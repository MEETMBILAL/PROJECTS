export type ComicStatus = "ONGOING" | "COMPLETED" | "HIATUS";
export type ComicType = "MANGA" | "MANHWA" | "MANHUA";
export type LeaderboardPeriod = "WEEKLY" | "MONTHLY" | "ALL_TIME";

export interface GenreDTO {
  id: string;
  name: string;
  slug: string;
}

export interface ChapterDTO {
  id: string;
  number: number;
  title: string | null;
  views: number;
  publishedAt: string; // ISO string
  pageCount?: number;
}

export interface ComicCardDTO {
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
  latestChapters: ChapterDTO[];
}

export interface ComicDetailDTO extends ComicCardDTO {
  altTitles: string[];
  bannerImage: string | null;
  synopsis: string;
  author: string | null;
  artist: string | null;
  releaseYear: number | null;
  weeklyViews: number;
  monthlyViews: number;
  createdAt: string;
  genres: GenreDTO[];
  chapterCount: number;
}

export interface PageImageDTO {
  pageIndex: number;
  imageUrl: string;
  width?: number;
  height?: number;
}

export interface LeaderboardEntryDTO extends ComicCardDTO {
  rank: number;
  rankChange: number; // positive = up, negative = down, 0 = no change
  periodViews: number;
}

export interface ComicListResult {
  comics: ComicCardDTO[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ComicFilters {
  genres?: string[]; // genre slugs
  status?: ComicStatus;
  type?: ComicType;
  sort?: "latest" | "az" | "rating" | "views";
  search?: string;
  page?: number;
  pageSize?: number;
}
