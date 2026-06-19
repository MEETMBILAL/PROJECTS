import type { Prisma } from "@prisma/client";
import type { ComicCardData, ComicDetailData, ChapterSummary } from "@/types";

export const comicCardSelect = {
  id: true,
  slug: true,
  title: true,
  coverImage: true,
  status: true,
  type: true,
  avgRating: true,
  ratingCount: true,
  totalViews: true,
  isNew: true,
  isHot: true,
  updatedAt: true,
  genres: { select: { genre: { select: { name: true } } } },
  chapters: {
    orderBy: { number: "desc" as const },
    take: 3,
    select: {
      id: true,
      number: true,
      title: true,
      views: true,
      publishedAt: true,
    },
  },
} satisfies Prisma.ComicSelect;

type ComicCardRow = Prisma.ComicGetPayload<{ select: typeof comicCardSelect }>;

export function toChapterSummary(c: {
  id: string;
  number: number;
  title: string | null;
  views: number;
  publishedAt: Date;
}): ChapterSummary {
  return {
    id: c.id,
    number: c.number,
    title: c.title,
    views: c.views,
    publishedAt: c.publishedAt.toISOString(),
  };
}

export function toComicCard(c: ComicCardRow): ComicCardData {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    coverImage: c.coverImage,
    status: c.status,
    type: c.type,
    avgRating: c.avgRating,
    ratingCount: c.ratingCount,
    totalViews: c.totalViews,
    isNew: c.isNew,
    isHot: c.isHot,
    updatedAt: c.updatedAt.toISOString(),
    genres: c.genres.map((g) => g.genre.name),
    latestChapters: c.chapters.map(toChapterSummary),
  };
}

export const comicDetailSelect = {
  ...comicCardSelect,
  altTitles: true,
  bannerImage: true,
  synopsis: true,
  author: true,
  artist: true,
  releaseYear: true,
  _count: { select: { chapters: true } },
} satisfies Prisma.ComicSelect;

type ComicDetailRow = Prisma.ComicGetPayload<{ select: typeof comicDetailSelect }>;

export function toComicDetail(c: ComicDetailRow): ComicDetailData {
  return {
    ...toComicCard(c),
    altTitles: c.altTitles,
    bannerImage: c.bannerImage,
    synopsis: c.synopsis,
    author: c.author,
    artist: c.artist,
    releaseYear: c.releaseYear,
    chapterCount: c._count.chapters,
  };
}
