import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/redis";
import { PAGE_SIZE } from "@/lib/constants";
import type {
  ComicCardData,
  ComicFilters,
  PaginatedResponse,
  SortOption,
} from "@/lib/types";

const cardSelect = {
  id: true,
  slug: true,
  title: true,
  coverImage: true,
  status: true,
  type: true,
  avgRating: true,
  totalViews: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ComicSelect;

const cardWithChapters = {
  ...cardSelect,
  genres: { select: { genre: { select: { id: true, name: true, slug: true } } } },
  chapters: {
    orderBy: { number: "desc" as const },
    take: 3,
    select: { id: true, number: true, title: true, publishedAt: true, views: true },
  },
} satisfies Prisma.ComicSelect;

function orderByFor(sort: SortOption | undefined): Prisma.ComicOrderByWithRelationInput {
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

export async function getComics(filters: ComicFilters): Promise<PaginatedResponse<ComicCardData>> {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(60, filters.limit ?? PAGE_SIZE);

  const where: Prisma.ComicWhereInput = {};

  if (filters.status && filters.status !== "ALL") where.status = filters.status;
  if (filters.type && filters.type !== "ALL") where.type = filters.type;
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { altTitles: { has: filters.q } },
      { author: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  if (filters.genres?.length) {
    where.AND = filters.genres.map((g) => ({
      genres: { some: { genre: { slug: g } } },
    }));
  }

  const [total, items] = await Promise.all([
    prisma.comic.count({ where }),
    prisma.comic.findMany({
      where,
      orderBy: orderByFor(filters.sort),
      skip: (page - 1) * limit,
      take: limit,
      select: cardWithChapters,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items: items as unknown as ComicCardData[],
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
}

export async function getComicBySlug(slug: string) {
  return prisma.comic.findUnique({
    where: { slug },
    include: {
      genres: { select: { genre: true } },
      _count: { select: { chapters: true, bookmarks: true } },
    },
  });
}

export async function getChaptersForComic(comicId: string) {
  return prisma.chapter.findMany({
    where: { comicId },
    orderBy: { number: "desc" },
    select: { id: true, number: true, title: true, publishedAt: true, views: true },
  });
}

export async function getChapterWithPages(slug: string, number: number) {
  const comic = await prisma.comic.findUnique({
    where: { slug },
    select: { id: true, slug: true, title: true, coverImage: true },
  });
  if (!comic) return null;

  const chapter = await prisma.chapter.findFirst({
    where: { comicId: comic.id, number },
    include: { pages: { orderBy: { index: "asc" } } },
  });
  if (!chapter) return null;

  const [prev, next, allChapters] = await Promise.all([
    prisma.chapter.findFirst({
      where: { comicId: comic.id, number: { lt: number } },
      orderBy: { number: "desc" },
      select: { number: true },
    }),
    prisma.chapter.findFirst({
      where: { comicId: comic.id, number: { gt: number } },
      orderBy: { number: "asc" },
      select: { number: true },
    }),
    prisma.chapter.findMany({
      where: { comicId: comic.id },
      orderBy: { number: "desc" },
      select: { number: true, title: true },
    }),
  ]);

  return {
    comic,
    chapter,
    prevNumber: prev?.number ?? null,
    nextNumber: next?.number ?? null,
    allChapters,
  };
}

export async function getTrending(limit = 10): Promise<ComicCardData[]> {
  return cached(`trending:${limit}`, 60, async () => {
    const items = await prisma.comic.findMany({
      orderBy: [{ weeklyViews: "desc" }, { totalViews: "desc" }],
      take: limit,
      select: cardWithChapters,
    });
    return items.map((c, i) => ({ ...(c as unknown as ComicCardData), rank: i + 1 }));
  });
}

export async function getLatestUpdates(limit = 18): Promise<ComicCardData[]> {
  return cached(`latest:${limit}`, 30, async () => {
    const items = await prisma.comic.findMany({
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: cardWithChapters,
    });
    return items as unknown as ComicCardData[];
  });
}

export async function getNewTitles(limit = 12): Promise<ComicCardData[]> {
  return cached(`new:${limit}`, 120, async () => {
    const items = await prisma.comic.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: cardWithChapters,
    });
    return items as unknown as ComicCardData[];
  });
}

export async function getCompleted(limit = 12): Promise<ComicCardData[]> {
  return cached(`completed:${limit}`, 120, async () => {
    const items = await prisma.comic.findMany({
      where: { status: "COMPLETED" },
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: cardWithChapters,
    });
    return items as unknown as ComicCardData[];
  });
}

export async function getFeatured(limit = 6): Promise<ComicCardData[]> {
  return cached(`featured:${limit}`, 120, async () => {
    let items = await prisma.comic.findMany({
      where: { isFeatured: true },
      orderBy: { totalViews: "desc" },
      take: limit,
      select: cardWithChapters,
    });
    if (items.length === 0) {
      items = await prisma.comic.findMany({
        orderBy: { totalViews: "desc" },
        take: limit,
        select: cardWithChapters,
      });
    }
    return items as unknown as ComicCardData[];
  });
}

export async function getRelated(comicId: string, genreSlugs: string[], limit = 12): Promise<ComicCardData[]> {
  const items = await prisma.comic.findMany({
    where: {
      id: { not: comicId },
      genres: { some: { genre: { slug: { in: genreSlugs } } } },
    },
    orderBy: { totalViews: "desc" },
    take: limit,
    select: cardWithChapters,
  });
  return items as unknown as ComicCardData[];
}

export async function getLeaderboard(
  period: "weekly" | "monthly" | "all" = "weekly",
  limit = 20,
): Promise<ComicCardData[]> {
  const orderBy: Prisma.ComicOrderByWithRelationInput =
    period === "weekly"
      ? { weeklyViews: "desc" }
      : period === "monthly"
        ? { monthlyViews: "desc" }
        : { totalViews: "desc" };

  return cached(`leaderboard:${period}:${limit}`, 120, async () => {
    const items = await prisma.comic.findMany({
      orderBy,
      take: limit,
      select: cardWithChapters,
    });
    return items.map((c, i) => ({
      ...(c as unknown as ComicCardData),
      rank: i + 1,
      // Deterministic pseudo rank-change indicator for UI.
      rankChange: ((c.title.charCodeAt(0) + i) % 3) - 1,
    }));
  });
}

export async function searchComics(q: string, limit = 8): Promise<ComicCardData[]> {
  if (!q.trim()) return [];
  const items = await prisma.comic.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { author: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { totalViews: "desc" },
    take: limit,
    select: cardWithChapters,
  });
  return items as unknown as ComicCardData[];
}

export async function getAllGenres() {
  return cached("genres:all", 600, () =>
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
  );
}
