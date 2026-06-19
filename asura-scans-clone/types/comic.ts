export type ComicStatus = "ONGOING" | "COMPLETED" | "HIATUS";
export type ComicType = "MANGA" | "MANHWA" | "MANHUA";

export type Genre = {
  id: string;
  name: string;
  slug: string;
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  views: number;
  publishedAt: string;
};

export type ChapterPage = {
  id: string;
  pageIndex: number;
  imageUrl: string;
  width?: number;
  height?: number;
};

export type Comic = {
  id: string;
  slug: string;
  title: string;
  altTitles: string[];
  coverImage: string;
  bannerImage?: string;
  synopsis: string;
  status: ComicStatus;
  type: ComicType;
  author: string;
  artist: string;
  releaseYear: number;
  totalViews: number;
  avgRating: number;
  ratingCount: number;
  genres: Genre[];
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
};

export type ComicListResponse = {
  items: Comic[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};
