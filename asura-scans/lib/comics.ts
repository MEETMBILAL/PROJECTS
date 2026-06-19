import { Prisma, ComicStatus, ComicType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCached } from "@/lib/redis";
import type { ComicFilters, SortOption } from "@/types";

const comicInclude = {
  genres: { include: { genre: true } },
  chapters: {
    orderBy: { number: "desc" as const },
    take: 3,
    select: {
      id: true,
      number: true,
      title: true,
      publishedAt: true,
      views: true,
    },
  },
};

function getOrderBy(sort: SortOption = "latest"): Prisma.ComicOrderByWithRelationInput {
  switch (sort) {
    case "az":
      return { title: "asc" };
    case "rating":
      return { avgRating: "desc" };
    case "views":
      return { totalViews: "desc" };
    default:
      return { updatedAt: "desc" };
  }
}

function buildWhere(filters: ComicFilters): Prisma.ComicWhereInput {
  const where: Prisma.ComicWhereInput = {};

  if (filters.genres?.length) {
    where.genres = {
      some: { genre: { slug: { in: filters.genres } } },
    };
  }

  if (filters.status?.length) {
    where.status = { in: filters.status };
  }

  if (filters.type?.length) {
    where.type = { in: filters.type };
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { altTitles: { has: filters.search } },
    ];
  }

  return where;
}

export function mapComic(comic: {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  status: ComicStatus;
  type: ComicType;
  avgRating: number;
  ratingCount: number;
  totalViews: number;
  genres?: Array<{ genre: { id: string; name: string; slug: string } }>;
  chapters?: Array<{
    id: string;
    number: number;
    title: string | null;
    publishedAt: Date;
    views: number;
  }>;
}) {
  return {
    id: comic.id,
    slug: comic.slug,
    title: comic.title,
    coverImage: comic.coverImage,
    status: comic.status,
    type: comic.type,
    avgRating: comic.avgRating,
    ratingCount: comic.ratingCount,
    totalViews: comic.totalViews,
    genres: comic.genres?.map((g) => g.genre) ?? [],
    chapters: comic.chapters ?? [],
    latestChapter: comic.chapters?.[0]
      ? {
          number: comic.chapters[0].number,
          title: comic.chapters[0].title,
          publishedAt: comic.chapters[0].publishedAt,
        }
      : undefined,
  };
}

export async function getComics(filters: ComicFilters = {}) {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 24;
  const skip = (page - 1) * limit;

  const where = buildWhere(filters);
  const orderBy = getOrderBy(filters.sort);

  const [comics, total] = await Promise.all([
    prisma.comic.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: comicInclude,
    }),
    prisma.comic.count({ where }),
  ]);

  return {
    comics: comics.map(mapComic),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + comics.length < total,
    },
  };
}

export async function getComicBySlug(slug: string) {
  const comic = await prisma.comic.findUnique({
    where: { slug },
    include: {
      genres: { include: { genre: true } },
      chapters: {
        orderBy: { number: "desc" },
        select: {
          id: true,
          number: true,
          title: true,
          publishedAt: true,
          views: true,
        },
      },
    },
  });

  if (!comic) return null;

  return {
    ...mapComic(comic),
    altTitles: comic.altTitles,
    bannerImage: comic.bannerImage,
    synopsis: comic.synopsis,
    author: comic.author,
    artist: comic.artist,
    releaseYear: comic.releaseYear,
    createdAt: comic.createdAt,
    updatedAt: comic.updatedAt,
  };
}

export async function getTrendingComics() {
  return getCached("trending:comics", async () => {
    const comics = await prisma.comic.findMany({
      orderBy: { totalViews: "desc" },
      take: 10,
      include: comicInclude,
    });
    return comics.map(mapComic);
  }, 600);
}

export async function getLatestComics(limit = 24) {
  return getCached(`latest:comics:${limit}`, async () => {
    const comics = await prisma.comic.findMany({
      orderBy: { updatedAt: "desc" },
      take: limit,
      include: comicInclude,
    });
    return comics.map(mapComic);
  }, 300);
}

export async function getNewComics(limit = 12) {
  const comics = await prisma.comic.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: comicInclude,
  });
  return comics.map(mapComic);
}

export async function getCompletedComics(limit = 12) {
  const comics = await prisma.comic.findMany({
    where: { status: "COMPLETED" },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: comicInclude,
  });
  return comics.map(mapComic);
}

export async function getFeaturedComics() {
  const comics = await prisma.comic.findMany({
    where: { featured: true },
    take: 5,
    include: {
      genres: { include: { genre: true } },
      chapters: {
        orderBy: { number: "desc" },
        take: 1,
        select: { number: true },
      },
    },
  });

  if (comics.length === 0) {
    const fallback = await prisma.comic.findMany({
      orderBy: { totalViews: "desc" },
      take: 5,
      include: {
        genres: { include: { genre: true } },
        chapters: {
          orderBy: { number: "desc" },
          take: 1,
          select: { number: true },
        },
      },
    });
    return fallback.map((c) => ({
      ...c,
      genres: c.genres.map((g) => g.genre),
      chapterCount: c.chapters[0]?.number ?? 0,
    }));
  }

  return comics.map((c) => ({
    ...c,
    genres: c.genres.map((g) => g.genre),
    chapterCount: c.chapters[0]?.number ?? 0,
  }));
}

export async function getRelatedComics(comicId: string, genreIds: string[], limit = 12) {
  const comics = await prisma.comic.findMany({
    where: {
      id: { not: comicId },
      genres: { some: { genreId: { in: genreIds } } },
    },
    take: limit,
    include: comicInclude,
  });
  return comics.map(mapComic);
}

export async function getChapterBySlugAndNumber(slug: string, num: number) {
  const comic = await prisma.comic.findUnique({ where: { slug } });
  if (!comic) return null;

  const chapter = await prisma.chapter.findUnique({
    where: { comicId_number: { comicId: comic.id, number: num } },
    include: {
      pages: { orderBy: { pageNum: "asc" } },
      comic: {
        select: {
          id: true,
          slug: true,
          title: true,
          coverImage: true,
        },
      },
    },
  });

  if (!chapter) return null;

  const [prev, next] = await Promise.all([
    prisma.chapter.findFirst({
      where: { comicId: comic.id, number: { lt: num } },
      orderBy: { number: "desc" },
      select: { number: true },
    }),
    prisma.chapter.findFirst({
      where: { comicId: comic.id, number: { gt: num } },
      orderBy: { number: "asc" },
      select: { number: true },
    }),
  ]);

  return { chapter, prev: prev?.number ?? null, next: next?.number ?? null };
}

export async function getAllGenres() {
  return prisma.genre.findMany({ orderBy: { name: "asc" } });
}

export async function incrementComicView(comicId: string, chapterId?: string, userId?: string) {
  await prisma.$transaction([
    prisma.comic.update({
      where: { id: comicId },
      data: { totalViews: { increment: 1 } },
    }),
    ...(chapterId
      ? [
          prisma.chapter.update({
            where: { id: chapterId },
            data: { views: { increment: 1 } },
          }),
        ]
      : []),
    prisma.view.create({
      data: { comicId, chapterId, userId },
    }),
  ]);
}

export async function getLeaderboard(period: "weekly" | "monthly" | "alltime" = "weekly") {
  const now = new Date();
  let since: Date | undefined;

  if (period === "weekly") {
    since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === "monthly") {
    since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  if (since) {
    const views = await prisma.view.groupBy({
      by: ["comicId"],
      where: { createdAt: { gte: since } },
      _count: { comicId: true },
      orderBy: { _count: { comicId: "desc" } },
      take: 50,
    });

    const comicIds = views.map((v) => v.comicId);
    const comics = await prisma.comic.findMany({
      where: { id: { in: comicIds } },
      include: comicInclude,
    });

    const comicMap = new Map(comics.map((c) => [c.id, mapComic(c)]));
    return views.map((v, i) => ({
      rank: i + 1,
      views: v._count.comicId,
      comic: comicMap.get(v.comicId)!,
    })).filter((item) => item.comic);
  }

  const comics = await prisma.comic.findMany({
    orderBy: { totalViews: "desc" },
    take: 50,
    include: comicInclude,
  });

  return comics.map((c, i) => ({
    rank: i + 1,
    views: c.totalViews,
    comic: mapComic(c),
  }));
}
