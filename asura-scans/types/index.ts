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
  latestChapter?: {
    number: number;
    title: string | null;
    publishedAt: Date;
  };
  chapters?: Array<{
    id: string;
    number: number;
    title: string | null;
    publishedAt: Date;
    views: number;
  }>;
  genres?: Array<{ id: string; name: string; slug: string }>;
}

export interface ComicDetail extends ComicListItem {
  altTitles: string[];
  bannerImage: string | null;
  synopsis: string;
  author: string | null;
  artist: string | null;
  releaseYear: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChapterItem {
  id: string;
  number: number;
  title: string | null;
  views: number;
  publishedAt: Date;
}

export interface BookmarkItem {
  id: string;
  comicId: string;
  lastReadChapter: number | null;
  comic: ComicListItem & {
    chapters: Array<{ number: number }>;
  };
}

export type SortOption = "latest" | "az" | "rating" | "views";

export interface ComicFilters {
  genres?: string[];
  status?: ComicStatus[];
  type?: ComicType[];
  sort?: SortOption;
  page?: number;
  limit?: number;
  search?: string;
}
