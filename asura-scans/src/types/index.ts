import { ComicStatus, ComicType } from "@prisma/client";

export interface ComicCardData {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  avgRating: number;
  status: ComicStatus;
  type: ComicType;
  latestChapter?: number;
  latestChapterTitle?: string;
  recentChapters?: ChapterPreview[];
  rank?: number;
  isNew?: boolean;
}

export interface ChapterPreview {
  id: string;
  number: number;
  title: string | null;
  publishedAt: string;
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

export interface ChapterData {
  id: string;
  number: number;
  title: string | null;
  views: number;
  publishedAt: string;
}

export interface ChapterPageData {
  pageNum: number;
  imageUrl: string;
}

export interface BrowseFilters {
  genres?: string[];
  status?: ComicStatus[];
  type?: ComicType[];
  sort?: "latest" | "az" | "rating" | "views";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  rankChange: number;
  comic: ComicCardData;
  views: number;
}
