import type { Comic, Chapter, Genre, ComicStatus, ComicType } from "@prisma/client";

export type { ComicStatus, ComicType };

export type ChapterPreview = Pick<Chapter, "id" | "number" | "title" | "publishedAt" | "views">;

export type ComicCardData = Pick<
  Comic,
  | "id"
  | "slug"
  | "title"
  | "coverImage"
  | "status"
  | "type"
  | "avgRating"
  | "totalViews"
  | "createdAt"
  | "updatedAt"
> & {
  genres?: { genre: Pick<Genre, "id" | "name" | "slug"> }[];
  chapters?: ChapterPreview[];
  latestChapter?: number | null;
  rank?: number;
  rankChange?: number;
  unreadCount?: number;
  lastReadChapter?: number | null;
};

export interface ComicFilters {
  genres?: string[];
  status?: ComicStatus | "ALL";
  type?: ComicType | "ALL";
  sort?: SortOption;
  q?: string;
  page?: number;
  limit?: number;
}

export type SortOption = "latest" | "az" | "rating" | "views";

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "az", label: "A-Z" },
  { value: "rating", label: "Rating" },
  { value: "views", label: "Views" },
];
