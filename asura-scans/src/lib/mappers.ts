import type { Prisma } from "@prisma/client";
import type {
  ChapterDTO,
  ComicCardDTO,
  ComicDetailDTO,
  ComicStatus,
  ComicType,
} from "./types";

const NEW_WINDOW_MS = 30 * 24 * 3600 * 1000;
const HOT_WEEKLY_VIEWS = 250_000;

type ComicWithRelations = Prisma.ComicGetPayload<{
  include: {
    genres: { include: { genre: true } };
    chapters: true;
    _count: { select: { chapters: true } };
  };
}>;

export function mapChapter(
  ch: Prisma.ChapterGetPayload<{ include?: { _count?: { select: { pages: true } } } }> & {
    _count?: { pages: number };
  },
): ChapterDTO {
  return {
    id: ch.id,
    number: ch.number,
    title: ch.title,
    views: ch.views,
    publishedAt: ch.publishedAt.toISOString(),
    pageCount: ch._count?.pages,
  };
}

export function mapComicToCard(comic: ComicWithRelations): ComicCardDTO {
  const latestChapters = [...comic.chapters]
    .sort((a, b) => b.number - a.number)
    .slice(0, 3)
    .map(mapChapter);
  return {
    id: comic.id,
    slug: comic.slug,
    title: comic.title,
    coverImage: comic.coverImage,
    status: comic.status as ComicStatus,
    type: comic.type as ComicType,
    avgRating: comic.avgRating,
    ratingCount: comic.ratingCount,
    totalViews: comic.totalViews,
    isNew: Date.now() - comic.createdAt.getTime() < NEW_WINDOW_MS,
    isHot: comic.weeklyViews > HOT_WEEKLY_VIEWS,
    updatedAt: comic.updatedAt.toISOString(),
    latestChapters,
  };
}

export function mapComicToDetail(comic: ComicWithRelations): ComicDetailDTO {
  return {
    ...mapComicToCard(comic),
    altTitles: comic.altTitles,
    bannerImage: comic.bannerImage,
    synopsis: comic.synopsis,
    author: comic.author,
    artist: comic.artist,
    releaseYear: comic.releaseYear,
    weeklyViews: comic.weeklyViews,
    monthlyViews: comic.monthlyViews,
    createdAt: comic.createdAt.toISOString(),
    genres: comic.genres.map((g) => ({
      id: g.genre.id,
      name: g.genre.name,
      slug: g.genre.slug,
    })),
    chapterCount: comic._count.chapters,
  };
}

export const comicInclude = {
  genres: { include: { genre: true } },
  chapters: { orderBy: { number: "desc" as const }, take: 3 },
  _count: { select: { chapters: true } },
} satisfies Prisma.ComicInclude;
