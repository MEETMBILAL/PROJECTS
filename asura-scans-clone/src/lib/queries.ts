import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  comicCardSelect,
  comicDetailSelect,
  toComicCard,
  toComicDetail,
} from "@/lib/serializers";
import type {
  ComicCardData,
  ComicDetailData,
  PaginatedResult,
  LeaderboardEntry,
} from "@/types";
import { PAGE_SIZE, type SortOption } from "@/lib/constants";

export interface ComicListFilters {
  genres?: string[];
  status?: string;
  type?: string;
  sort?: SortOption;
  search?: string;
  page?: number;
  pageSize?: number;
}

function buildOrderBy(sort?: SortOption): Prisma.ComicOrderByWithRelationInput {
  switch (sort) {
    case "az":
      return { title: "asc" };
    case "rating":
      return { avgRating: "desc" };
    case "views":
      return { totalViews: "desc" };
    case "latest":
    default:
      return { updatedAt: "desc" };
  }
}

export async function getComics(
  filters: ComicListFilters = {}
): Promise<PaginatedResult<ComicCardData>> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? PAGE_SIZE;

  const where: Prisma.ComicWhereInput = {};

  if (filters.status) where.status = filters.status as Prisma.ComicWhereInput["status"];
  if (filters.type) where.type = filters.type as Prisma.ComicWhereInput["type"];

  if (filters.genres && filters.genres.length > 0) {
    where.AND = filters.genres.map((g) => ({
      genres: { some: { genre: { name: { equals: g, mode: "insensitive" } } } },
    }));
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { altTitles: { has: filters.search } },
      { author: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.comic.findMany({
      where,
      select: comicCardSelect,
      orderBy: buildOrderBy(filters.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.comic.count({ where }),
  ]);

  return {
    items: items.map(toComicCard),
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  };
}

export async function getComicBySlug(
  slug: string
): Promise<ComicDetailData | null> {
  const comic = await prisma.comic.findUnique({
    where: { slug },
    select: comicDetailSelect,
  });
  return comic ? toComicDetail(comic) : null;
}

export async function getTrending(limit = 10): Promise<ComicCardData[]> {
  const items = await prisma.comic.findMany({
    where: { weeklyViews: { gt: 0 } },
    select: comicCardSelect,
    orderBy: { weeklyViews: "desc" },
    take: limit,
  });
  if (items.length === 0) {
    const fallback = await prisma.comic.findMany({
      select: comicCardSelect,
      orderBy: { totalViews: "desc" },
      take: limit,
    });
    return fallback.map(toComicCard);
  }
  return items.map(toComicCard);
}

export async function getLatestUpdates(limit = 18): Promise<ComicCardData[]> {
  const items = await prisma.comic.findMany({
    select: comicCardSelect,
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
  return items.map(toComicCard);
}

export async function getNewTitles(limit = 12): Promise<ComicCardData[]> {
  const items = await prisma.comic.findMany({
    where: { isNew: true },
    select: comicCardSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return items.map(toComicCard);
}

export async function getCompleted(limit = 12): Promise<ComicCardData[]> {
  const items = await prisma.comic.findMany({
    where: { status: "COMPLETED" },
    select: comicCardSelect,
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
  return items.map(toComicCard);
}

export async function getFeatured(limit = 5): Promise<ComicDetailData[]> {
  const items = await prisma.comic.findMany({
    where: { featured: true },
    select: comicDetailSelect,
    orderBy: { totalViews: "desc" },
    take: limit,
  });
  if (items.length > 0) return items.map(toComicDetail);

  const fallback = await prisma.comic.findMany({
    select: comicDetailSelect,
    orderBy: { totalViews: "desc" },
    take: limit,
  });
  return fallback.map(toComicDetail);
}

export async function getRelated(
  comicId: string,
  genreNames: string[],
  limit = 12
): Promise<ComicCardData[]> {
  const items = await prisma.comic.findMany({
    where: {
      id: { not: comicId },
      genres: { some: { genre: { name: { in: genreNames } } } },
    },
    select: comicCardSelect,
    orderBy: { totalViews: "desc" },
    take: limit,
  });
  return items.map(toComicCard);
}

export async function searchComics(
  query: string,
  limit = 12
): Promise<ComicCardData[]> {
  if (!query.trim()) return [];
  const items = await prisma.comic.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { altTitles: { has: query } },
        { author: { contains: query, mode: "insensitive" } },
      ],
    },
    select: comicCardSelect,
    orderBy: { totalViews: "desc" },
    take: limit,
  });
  return items.map(toComicCard);
}

export async function getLeaderboard(
  period: "weekly" | "monthly" | "all" = "weekly",
  limit = 30
): Promise<LeaderboardEntry[]> {
  const orderBy: Prisma.ComicOrderByWithRelationInput =
    period === "weekly"
      ? { weeklyViews: "desc" }
      : period === "monthly"
        ? { monthlyViews: "desc" }
        : { totalViews: "desc" };

  const items = await prisma.comic.findMany({
    select: {
      ...comicCardSelect,
      weeklyViews: true,
      monthlyViews: true,
    },
    orderBy,
    take: limit,
  });

  return items.map((c, i) => {
    const periodViews =
      period === "weekly"
        ? c.weeklyViews
        : period === "monthly"
          ? c.monthlyViews
          : c.totalViews;
    // Deterministic pseudo rank-change for the indicator (no historical table).
    const seed = (c.id.charCodeAt(0) + i) % 5;
    const rankChange = seed - 2; // range -2..2
    return {
      ...toComicCard(c),
      rank: i + 1,
      rankChange,
      periodViews,
    };
  });
}

export async function getChapters(comicId: string) {
  const chapters = await prisma.chapter.findMany({
    where: { comicId },
    orderBy: { number: "desc" },
    select: {
      id: true,
      number: true,
      title: true,
      views: true,
      publishedAt: true,
    },
  });
  return chapters.map((c) => ({
    id: c.id,
    number: c.number,
    title: c.title,
    views: c.views,
    publishedAt: c.publishedAt.toISOString(),
  }));
}

export async function getChapterForReader(slug: string, number: number) {
  const comic = await prisma.comic.findUnique({
    where: { slug },
    select: { id: true, slug: true, title: true, coverImage: true },
  });
  if (!comic) return null;

  const chapter = await prisma.chapter.findFirst({
    where: { comicId: comic.id, number },
    select: {
      id: true,
      number: true,
      title: true,
      pages: {
        orderBy: { pageNumber: "asc" },
        select: { id: true, pageNumber: true, imageUrl: true, width: true, height: true },
      },
    },
  });
  if (!chapter) return null;

  const allChapters = await prisma.chapter.findMany({
    where: { comicId: comic.id },
    orderBy: { number: "asc" },
    select: { number: true, title: true },
  });

  const idx = allChapters.findIndex((c) => c.number === number);
  const prev = idx > 0 ? allChapters[idx - 1].number : null;
  const next = idx < allChapters.length - 1 ? allChapters[idx + 1].number : null;

  return {
    comic,
    chapter: {
      id: chapter.id,
      number: chapter.number,
      title: chapter.title,
      pages: chapter.pages,
    },
    chapters: allChapters.map((c) => ({ number: c.number, title: c.title })),
    prev,
    next,
  };
}
