import { prisma } from "./prisma";
import { cacheGet, cacheSet } from "./redis";
import {
  FeaturedComic,
  TrendingComic,
  ComicCardData,
} from "@/types";

export async function getFeaturedComics(): Promise<FeaturedComic[]> {
  const comics = await prisma.comic.findMany({
    where: { featured: true },
    take: 8,
    include: {
      genres: { include: { genre: true } },
      _count: { select: { chapters: true } },
    },
  });

  if (comics.length === 0) {
    const fallback = await prisma.comic.findMany({
      take: 8,
      orderBy: { avgRating: "desc" },
      include: {
        genres: { include: { genre: true } },
        _count: { select: { chapters: true } },
      },
    });
    return fallback.map(mapFeatured);
  }

  return comics.map(mapFeatured);
}

function mapFeatured(c: {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  synopsis: string;
  avgRating: number;
  genres: { genre: { name: string } }[];
  _count: { chapters: number };
}): FeaturedComic {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    coverImage: c.coverImage,
    synopsis: c.synopsis,
    avgRating: c.avgRating,
    chapterCount: c._count.chapters,
    genres: c.genres.map((g) => g.genre.name),
  };
}

export async function getTrendingComics(): Promise<TrendingComic[]> {
  const cached = await cacheGet<TrendingComic[]>("trending");
  if (cached) return cached;

  const comics = await prisma.comic.findMany({
    orderBy: { totalViews: "desc" },
    take: 10,
    include: { chapters: { orderBy: { number: "desc" }, take: 1 } },
  });

  const result = comics.map((c, i) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    coverImage: c.coverImage,
    avgRating: c.avgRating,
    latestChapter: c.chapters[0]?.number,
    rank: i + 1,
  }));

  await cacheSet("trending", result, 300);
  return result;
}

export async function getLatestUpdates(limit = 24) {
  const comics = await prisma.comic.findMany({
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      chapters: { orderBy: { publishedAt: "desc" }, take: 3 },
    },
  });

  return comics.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    coverImage: c.coverImage,
    avgRating: c.avgRating,
    latestChapters: c.chapters.map((ch) => ({
      id: ch.id,
      number: ch.number,
      title: ch.title,
      publishedAt: ch.publishedAt.toISOString(),
    })),
  }));
}

export async function getComicsByStatus(
  status: "ONGOING" | "COMPLETED" | "HIATUS",
  limit = 12
): Promise<ComicCardData[]> {
  const comics = await prisma.comic.findMany({
    where: { status },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: { chapters: { orderBy: { number: "desc" }, take: 1 } },
  });

  return comics.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    coverImage: c.coverImage,
    avgRating: c.avgRating,
    status: c.status,
    latestChapter: c.chapters[0]?.number,
  }));
}

export async function getNewTitles(limit = 12): Promise<ComicCardData[]> {
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const comics = await prisma.comic.findMany({
    where: { createdAt: { gte: monthAgo } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { chapters: { orderBy: { number: "desc" }, take: 1 } },
  });

  if (comics.length < limit) {
    const more = await prisma.comic.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { chapters: { orderBy: { number: "desc" }, take: 1 } },
    });
    return more.map(mapComicCard);
  }

  return comics.map(mapComicCard);
}

function mapComicCard(c: {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  avgRating: number;
  status?: string;
  chapters: { number: number }[];
}): ComicCardData {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    coverImage: c.coverImage,
    avgRating: c.avgRating,
    latestChapter: c.chapters[0]?.number,
  };
}

export async function getAllGenres() {
  return prisma.genre.findMany({ orderBy: { name: "asc" } });
}
