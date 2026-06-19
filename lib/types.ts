export type ComicStatus = 'ONGOING' | 'COMPLETED' | 'HIATUS';
export type ComicType = 'MANGA' | 'MANHWA' | 'MANHUA';

export interface ChapterPageDTO {
  id: string;
  pageNumber: number;
  imageUrl: string;
  width?: number;
  height?: number;
}

export interface ChapterDTO {
  id: string;
  number: number;
  title: string;
  views: number;
  publishedAt: string;
  pages: ChapterPageDTO[];
}

export interface ComicDTO {
  id: string;
  slug: string;
  title: string;
  altTitles: string[];
  coverImage: string;
  bannerImage: string;
  synopsis: string;
  status: ComicStatus;
  type: ComicType;
  author: string;
  artist: string;
  releaseYear: number;
  totalViews: number;
  avgRating: number;
  ratingCount: number;
  genres: string[];
  chapters: ChapterDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedComics {
  items: ComicDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ComicQuery {
  q?: string;
  genres?: string[];
  status?: ComicStatus;
  type?: ComicType;
  sort?: 'latest' | 'az' | 'rating' | 'views';
  page?: number;
  pageSize?: number;
}
