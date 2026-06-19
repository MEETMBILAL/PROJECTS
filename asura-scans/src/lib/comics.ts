import { prisma } from "./prisma";
import { getCached } from "./redis";
import { ComicStatus, ComicType, Prisma } from "@prisma/client";
import { ComicCardData, ComicDetail, ChapterData, BrowseFilters } from "@/types";

async function getLatestChapter(comicId: string) {
  return prisma.chapter.findFirst({
    where: { comicId },
    orderBy: { number: "desc" },
    select: { number: true, title: true, publishedAt: true, id: true },
  });
}

async function getRecentChapters(comicId: string, limit = 3) {
  return prisma.chapter.findMany({
    where: { comicId },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: { id: true, number: true, title: true, publishedAt: true },
  });
}

function toComicCard(
  comic: {
    id: string;
    slug: string;
    title: string;
    coverImage: string;
    avgRating: number;
    status: ComicStatus;
    type: ComicType;
    isNew?: boolean;
  },
  extras?: {
    latestChapter?: number;
    rank?: number;
    recentChapters?: { id: string; number: number; title: string | null; publishedAt: Date }[];
  }
): ComicCardData {
  return {
    id: comic.id,
    slug: comic.slug,
    title: comic.title,
    coverImage: comic.coverImage,
    avgRating: comic.avgRating,
    status: comic.status,
    type: comic.type,
    isNew: comic.isNew,
    latestChapter: extras?.latestChapter,
    rank: extras?.rank,
    recentChapters: extras?.recentChapters?.map((ch) => ({
      id: ch.id,
      number: ch.number,
      title: ch.title,
      publishedAt: ch.publishedAt.toISOString(),
    })),
  };
}

export async function getFeaturedComics(): Promise<ComicCardData[]> {
  return getCached("featured-comics", async () => {
    const comics = await prisma.comic.findMany({
      where: { featured: true },
      take: 5,
      orderBy: { avgRating: "desc" },
    });

    const result = await Promise.all(
      comics.map(async (comic) => {
        const latest = await getLatestChapter(comic.id);
        return toComicCard(comic, { latestChapter: latest?.number });
      })
    );
    return result;
  });
}

export async function getTrendingComics(): Promise<ComicCardData[]> {
  return getCached("trending-comics", async () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const viewCounts = await prisma.view.groupBy({
      by: ["comicId"],
      where: { createdAt: { gte: weekAgo } },
      _count: { comicId: true },
      orderBy: { _count: { comicId: "desc" } },
      take: 10,
    });

    const comicIds = viewCounts.map((v) => v.comicId);
    const comics = await prisma.comic.findMany({
      where: { id: { in: comicIds } },
    });

    const comicMap = new Map(comics.map((c) => [c.id, c]));
    const result: ComicCardData[] = [];

    for (let i = 0; i < viewCounts.length; i++) {
      const comic = comicMap.get(viewCounts[i].comicId);
      if (!comic) continue;
      const latest = await getLatestChapter(comic.id);
      result.push(
        toComicCard(comic, { latestChapter: latest?.number, rank: i + 1 })
      );
    }

    if (result.length < 10) {
      const existing = new Set(result.map((c) => c.id));
      const fallback = await prisma.comic.findMany({
        where: { id: { notIn: Array.from(existing) } },
        orderBy: { totalViews: "desc" },
        take: 10 - result.length,
      });
      for (const comic of fallback) {
        const latest = await getLatestChapter(comic.id);
        result.push(
          toComicCard(comic, {
            latestChapter: latest?.number,
            rank: result.length + 1,
          })
        );
      }
    }

    return result;
  }, 600);
}

export async function getLatestUpdates(limit = 24): Promise<ComicCardData[]> {
  return getCached(`latest-updates-${limit}`, async () => {
    const comics = await prisma.comic.findMany({
      orderBy: { updatedAt: "desc" },
      take: limit,
    });

    return Promise.all(
      comics.map(async (comic) => {
        const recent = await getRecentChapters(comic.id);
        return toComicCard(comic, {
          latestChapter: recent[0]?.number,
          recentChapters: recent,
        });
      })
    );
  });
}

export async function getNewTitles(limit = 12): Promise<ComicCardData[]> {
  return getCached(`new-titles-${limit}`, async () => {
    const comics = await prisma.comic.findMany({
      where: { isNew: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return Promise.all(
      comics.map(async (comic) => {
        const latest = await getLatestChapter(comic.id);
        return toComicCard(comic, { latestChapter: latest?.number });
      })
    );
  });
}

export async function getCompletedSeries(limit = 12): Promise<ComicCardData[]> {
  return getCached(`completed-${limit}`, async () => {
    const comics = await prisma.comic.findMany({
      where: { status: "COMPLETED" },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });

    return Promise.all(
      comics.map(async (comic) => {
        const latest = await getLatestChapter(comic.id);
        return toComicCard(comic, { latestChapter: latest?.number });
      })
    );
  });
}

export async function getComicBySlug(slug: string): Promise<ComicDetail | null> {
  const comic = await prisma.comic.findUnique({
    where: { slug },
    include: {
      genres: { include: { genre: true } },
      _count: { select: { chapters: true } },
    },
  });

  if (!comic) return null;

  const latest = await getLatestChapter(comic.id);

  return {
    id: comic.id,
    slug: comic.slug,
    title: comic.title,
    altTitles: comic.altTitles,
    coverImage: comic.coverImage,
    synopsis: comic.synopsis,
    status: comic.status,
    type: comic.type,
    author: comic.author,
    artist: comic.artist,
    releaseYear: comic.releaseYear,
    totalViews: comic.totalViews,
    avgRating: comic.avgRating,
    ratingCount: comic.ratingCount,
    latestChapter: latest?.number,
    genres: comic.genres.map((g) => ({
      id: g.genre.id,
      name: g.genre.name,
      slug: g.genre.slug,
    })),
    chapterCount: comic._count.chapters,
  };
}

export async function getChaptersByComicSlug(
  slug: string
): Promise<ChapterData[]> {
  const comic = await prisma.comic.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!comic) return [];

  const chapters = await prisma.chapter.findMany({
    where: { comicId: comic.id },
    orderBy: { number: "desc" },
  });

  return chapters.map((ch) => ({
    id: ch.id,
    number: ch.number,
    title: ch.title,
    views: ch.views,
    publishedAt: ch.publishedAt.toISOString(),
  }));
}

export async function browseComics(filters: BrowseFilters) {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 24;
  const skip = (page - 1) * limit;

  const where: Prisma.ComicWhereInput = {};

  if (filters.status?.length) {
    where.status = { in: filters.status };
  }
  if (filters.type?.length) {
    where.type = { in: filters.type };
  }
  if (filters.genres?.length) {
    where.genres = {
      some: { genre: { slug: { in: filters.genres } } },
    };
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
    prisma.comic.findMany({ where, orderBy, skip, take: limit }),
    prisma.comic.count({ where }),
  ]);

  const data = await Promise.all(
    comics.map(async (comic) => {
      const latest = await getLatestChapter(comic.id);
      return toComicCard(comic, { latestChapter: latest?.number });
    })
  );

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
}

export async function searchComicsDb(query: string, limit = 20) {
  const comics = await prisma.comic.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { altTitles: { hasSome: [query] } },
        { author: { contains: query, mode: "insensitive" } },
      ],
    },
    take: limit,
    orderBy: { totalViews: "desc" },
  });

  return Promise.all(
    comics.map(async (comic) => {
      const latest = await getLatestChapter(comic.id);
      return toComicCard(comic, { latestChapter: latest?.number });
    })
  );
}

export async function getLeaderboard(period: "weekly" | "monthly" | "alltime") {
  const since = new Date();
  if (period === "weekly") since.setDate(since.getDate() - 7);
  else if (period === "monthly") since.setMonth(since.getMonth() - 1);
  else since.setFullYear(2000);

  const viewCounts = await prisma.view.groupBy({
    by: ["comicId"],
    where: { createdAt: { gte: since } },
    _count: { comicId: true },
    orderBy: { _count: { comicId: "desc" } },
    take: 50,
  });

  const comicIds = viewCounts.map((v) => v.comicId);
  const comics = await prisma.comic.findMany({
    where: { id: { in: comicIds } },
  });
  const comicMap = new Map(comics.map((c) => [c.id, c]));

  const result = [];
  for (let i = 0; i < viewCounts.length; i++) {
    const comic = comicMap.get(viewCounts[i].comicId);
    if (!comic) continue;
    const latest = await getLatestChapter(comic.id);
    result.push({
      rank: i + 1,
      rankChange: Math.floor(Math.random() * 5) - 2,
      views: viewCounts[i]._count.comicId,
      comic: toComicCard(comic, { latestChapter: latest?.number }),
    });
  }

  return result;
}

export async function getRelatedComics(comicId: string, limit = 10) {
  const comic = await prisma.comic.findUnique({
    where: { id: comicId },
    include: { genres: true },
  });
  if (!comic) return [];

  const genreIds = comic.genres.map((g) => g.genreId);
  const related = await prisma.comic.findMany({
    where: {
      id: { not: comicId },
      genres: { some: { genreId: { in: genreIds } } },
    },
    take: limit,
    orderBy: { avgRating: "desc" },
  });

  return Promise.all(
    related.map(async (c) => {
      const latest = await getLatestChapter(c.id);
      return toComicCard(c, { latestChapter: latest?.number });
    })
  );
}

export async function getAllGenres() {
  return prisma.genre.findMany({ orderBy: { name: "asc" } });
}
