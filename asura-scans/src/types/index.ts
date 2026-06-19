import { ComicStatus, ComicType } from "@prisma/client";

export interface ComicCardData {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  avgRating: number;
  status?: ComicStatus;
  type?: ComicType;
  latestChapter?: number;
  latestChapters?: {
    id: string;
    number: number;
    title: string | null;
    publishedAt: string;
  }[];
}

export interface TrendingComic extends ComicCardData {
  rank: number;
}

export interface FeaturedComic extends ComicCardData {
  synopsis: string;
  chapterCount: number;
  genres: string[];
}

export interface ComicDetail extends ComicCardData {
  altTitles: string[];
  synopsis: string;
  author: string | null;
  artist: string | null;
  releaseYear: number | null;
  totalViews: number;
  ratingCount: number;
  genres: { id: string; name: string; slug: string }[];
  chapterCount: number;
}

export interface ChapterListItem {
  id: string;
  number: number;
  title: string | null;
  views: number;
  publishedAt: string;
}

export interface LeaderboardItem {
  rank: number;
  rankChange: number;
  comic: ComicCardData;
  views: number;
}

export interface BookmarkWithComic {
  id: string;
  lastReadChapter: number | null;
  comic: ComicCardData & {
    latestChapter: number;
    unreadCount: number;
  };
}
