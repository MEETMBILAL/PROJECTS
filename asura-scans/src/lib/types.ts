import type { ComicStatus, ComicType } from "@prisma/client";

export interface ComicListItem {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  status: ComicStatus;
  type: ComicType;
  avgRating: number;
  ratingCount: number;
  totalViews: number;
  updatedAt: Date;
  latestChapter?: {
    number: number;
    title: string | null;
    publishedAt: Date;
  };
  genres?: { name: string; slug: string }[];
}

export interface ComicDetail extends ComicListItem {
  altTitles: string[];
  synopsis: string;
  author: string | null;
  artist: string | null;
  releaseYear: number | null;
  chapters: ChapterListItem[];
}

export interface ChapterListItem {
  id: string;
  number: number;
  title: string | null;
  views: number;
  publishedAt: Date;
}

export interface TrendingComic extends ComicListItem {
  rank: number;
}

export interface LatestUpdateComic extends ComicListItem {
  recentChapters: {
    id: string;
    number: number;
    title: string | null;
    publishedAt: Date;
  }[];
}

export interface ComicFilters {
  genres?: string[];
  status?: ComicStatus[];
  type?: ComicType[];
  sort?: "latest" | "az" | "rating" | "views";
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface BookmarkWithComic {
  id: string;
  comicId: string;
  lastReadChapter: string | null;
  createdAt: Date;
  updatedAt: Date;
  comic: ComicListItem & {
    chapters: { number: number }[];
    lastChapter?: { number: number };
  };
  unreadCount: number;
}
