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
  pages?: ChapterPage[];
};

export type ChapterPage = {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  pageNumber: number;
};

export type Comic = {
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
  chapterCount: number;
  genres: Genre[];
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
  isHot?: boolean;
};

export type BrowseFilters = {
  genres?: string[];
  status?: ComicStatus | "ALL";
  type?: ComicType | "ALL";
  sort?: "latest" | "az" | "rating" | "views";
  page?: number;
};
