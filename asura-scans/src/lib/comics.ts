import { prisma } from "@/lib/prisma";
import { getCached, setCache } from "@/lib/redis";
import type { ComicFilters, PaginatedResponse, ComicListItem } from "@/lib/types";
import type { Prisma } from "@prisma/client";

const comicSelect = {
  id: true,
  slug: true,
  title: true,
  coverImage: true,
  status: true,
  type: true,
  avgRating: true,
  ratingCount: true,
  totalViews: true,
  updatedAt: true,
  genres: {
    select: {
      genre: { select: { name: true, slug: true } },
    },
  },
  chapters: {
    orderBy: { number: "desc" as const },
    take: 1,
    select: {
      number: true,
      title: true,
      publishedAt: true,
    },
  },
};

function mapComic(comic: {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  status: ComicListItem["status"];
  type: ComicListItem["type"];
  avgRating: number;
  ratingCount: number;
  totalViews: number;
  updatedAt: Date;
  genres?: { genre: { name: string; slug: string } }[];
  chapters?: { number: number; title: string | null; publishedAt: Date }[];
}): ComicListItem {
  const latest = comic.chapters?.[0];
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
    updatedAt: comic.updatedAt,
    latestChapter: latest
      ? { number: latest.number, title: latest.title, publishedAt: latest.publishedAt }
      : undefined,
    genres: comic.genres?.map((g) => g.genre),
  };
}

export async function getTrendingComics() {
  const cacheKey = "trending:today";
  const cached = await getCached<ComicListItem[]>(cacheKey);
  if (cached) return cached;

  const comics = await prisma.comic.findMany({
    orderBy: { totalViews: "desc" },
    take: 10,
    select: comicSelect,
  });

  const result = comics.map(mapComic);
  await setCache(cacheKey, result, 600);
  return result;
}

export async function getLatestUpdates(page = 1, limit = 18) {
  const comics = await prisma.comic.findMany({
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      ...comicSelect,
      chapters: {
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: {
          id: true,
          number: true,
          title: true,
          publishedAt: true,
        },
      },
    },
  });

  return comics.map((comic) => ({
    ...mapComic(comic),
    recentChapters: comic.chapters,
  }));
}

export async function getFeaturedComics() {
  const comics = await prisma.comic.findMany({
    where: { featured: true },
    take: 6,
    select: {
      ...comicSelect,
      synopsis: true,
      genres: comicSelect.genres,
    },
  });

  if (comics.length === 0) {
    const fallback = await prisma.comic.findMany({
      orderBy: { avgRating: "desc" },
      take: 6,
      select: {
        ...comicSelect,
        synopsis: true,
      },
    });
    return fallback.map((c) => ({ ...mapComic(c), synopsis: c.synopsis }));
  }

  return comics.map((c) => ({ ...mapComic(c), synopsis: c.synopsis }));
}

export async function getComicsByStatus(
  status: "ONGOING" | "COMPLETED" | "HIATUS",
  limit = 12
) {
  const comics = await prisma.comic.findMany({
    where: { status },
    orderBy: status === "COMPLETED" ? { updatedAt: "desc" } : { createdAt: "desc" },
    take: limit,
    select: comicSelect,
  });
  return comics.map(mapComic);
}

export async function getNewTitles(limit = 12) {
  const comics = await prisma.comic.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: comicSelect,
  });
  return comics.map(mapComic);
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
          views: true,
          publishedAt: true,
        },
      },
    },
  });

  if (!comic) return null;

  return {
    ...mapComic(comic),
    altTitles: comic.altTitles,
    synopsis: comic.synopsis,
    author: comic.author,
    artist: comic.artist,
    releaseYear: comic.releaseYear,
    genres: comic.genres.map((g) => ({ id: g.genre.id, name: g.genre.name, slug: g.genre.slug })),
    chapters: comic.chapters,
  };
}

export async function getComics(
  filters: ComicFilters
): Promise<PaginatedResponse<ComicListItem>> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 24;

  const where: Prisma.ComicWhereInput = {};

  if (filters.status?.length) {
    where.status = { in: filters.status };
  }

  if (filters.type?.length) {
    where.type = { in: filters.type };
  }

  if (filters.genres?.length) {
    where.genres = {
      some: {
        genre: { slug: { in: filters.genres } },
      },
    };
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { author: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.ComicOrderByWithRelationInput = { updatedAt: "desc" };
  switch (filters.sort) {
    case "az":
      orderBy = { title: "asc" };
      break;
    case "rating":
      orderBy = { avgRating: "desc" };
      break;
    case "views":
      orderBy = { totalViews: "desc" };
      break;
  }

  const [comics, total] = await Promise.all([
    prisma.comic.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: comicSelect,
    }),
    prisma.comic.count({ where }),
  ]);

  return {
    data: comics.map(mapComic),
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
}

export async function getRelatedComics(comicId: string, genreIds: string[], limit = 10) {
  const comics = await prisma.comic.findMany({
    where: {
      id: { not: comicId },
      genres: { some: { genreId: { in: genreIds } } },
    },
    take: limit,
    select: comicSelect,
  });
  return comics.map(mapComic);
}

export async function getLeaderboard(period: "weekly" | "monthly" | "alltime") {
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
      take: 10,
    });

    const comicIds = views.map((v) => v.comicId);
    const comics = await prisma.comic.findMany({
      where: { id: { in: comicIds } },
      select: comicSelect,
    });

    const comicMap = new Map(comics.map((c) => [c.id, c]));
    return views
      .map((v, i) => {
        const comic = comicMap.get(v.comicId);
        if (!comic) return null;
        return { ...mapComic(comic), rank: i + 1, periodViews: v._count.comicId };
      })
      .filter(Boolean);
  }

  const comics = await prisma.comic.findMany({
    orderBy: { totalViews: "desc" },
    take: 10,
    select: comicSelect,
  });

  return comics.map((c, i) => ({ ...mapComic(c), rank: i + 1, periodViews: c.totalViews }));
}

export async function searchComicsPrisma(query: string, limit = 20) {
  const comics = await prisma.comic.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { author: { contains: query, mode: "insensitive" } },
      ],
    },
    take: limit,
    select: comicSelect,
  });
  return comics.map(mapComic);
}

export async function getAllGenres() {
  return prisma.genre.findMany({ orderBy: { name: "asc" } });
}
