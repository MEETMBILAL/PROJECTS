import type { ComicStatus, ComicType } from "@prisma/client";

export type { ComicStatus, ComicType };

export interface ChapterSummary {
  id: string;
  number: number;
  title: string | null;
  views: number;
  publishedAt: string;
}

export interface ComicCardData {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  status: ComicStatus;
  type: ComicType;
  avgRating: number;
  ratingCount: number;
  totalViews: number;
  isNew: boolean;
  isHot: boolean;
  updatedAt: string;
  latestChapters: ChapterSummary[];
  genres?: string[];
}

export interface ComicDetailData extends ComicCardData {
  altTitles: string[];
  bannerImage: string | null;
  synopsis: string;
  author: string | null;
  artist: string | null;
  releaseYear: number | null;
  chapterCount: number;
}

export interface BookmarkData extends ComicCardData {
  bookmarkId: string;
  lastReadChapter: number | null;
  latestChapterNumber: number | null;
  unreadCount: number;
}

export interface LeaderboardEntry extends ComicCardData {
  rank: number;
  rankChange: number; // positive = up, negative = down, 0 = same
  periodViews: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ChapterPageData {
  id: string;
  pageNumber: number;
  imageUrl: string;
  width: number | null;
  height: number | null;
}
