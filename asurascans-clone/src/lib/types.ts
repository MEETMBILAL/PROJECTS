export type ComicStatus = "ONGOING" | "COMPLETED" | "HIATUS";
export type ComicType = "MANGA" | "MANHWA" | "MANHUA";

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface Chapter {
  id: string;
  comicId: string;
  number: number;
  title: string | null;
  views: number;
  publishedAt: string; // ISO string
}

export interface ChapterPage {
  id: string;
  chapterId: string;
  index: number;
  imageUrl: string;
  width?: number;
  height?: number;
}

export interface Comic {
  id: string;
  slug: string;
  title: string;
  altTitles: string[];
  coverImage: string;
  bannerImage?: string;
  synopsis: string;
  status: ComicStatus;
  type: ComicType;
  author?: string;
  artist?: string;
  releaseYear?: number;
  totalViews: number;
  avgRating: number;
  ratingCount: number;
  featured: boolean;
  isNew: boolean;
  isHot: boolean;
  createdAt: string;
  updatedAt: string;
  genres: Genre[];
  chapters: Chapter[];
}

export type ComicSort = "latest" | "az" | "rating" | "views";

export interface ComicFilters {
  genres?: string[];
  status?: ComicStatus | "ALL";
  type?: ComicType | "ALL";
  sort?: ComicSort;
  query?: string;
  page?: number;
  perPage?: number;
}

export interface PaginatedComics {
  items: Comic[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasMore: boolean;
}

export interface LeaderboardEntry extends Comic {
  rank: number;
  rankChange: number; // positive = up, negative = down, 0 = same
  periodViews: number;
}
