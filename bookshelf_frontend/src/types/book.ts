export interface Author {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  photo?: string;
  book_count?: number;
}

export interface Publisher {
  id: number;
  name: string;
  slug: string;
  website?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parent?: number | null;
  order?: number;
  is_active?: boolean;
  children?: Category[];
  book_count?: number;
}

export type BookFormat = "paperback" | "hardcover" | "ebook";

export interface Book {
  id: number;
  title: string;
  slug: string;
  authors: Author[];
  category?: string | Category | null;
  cover_image: string;
  short_description?: string;
  format: BookFormat;
  language: string;
  original_price: string;
  sale_price: string | null;
  effective_price: string;
  discount_percentage: number;
  currency: string;
  stock: number;
  in_stock: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  average_rating: number;
  review_count: number;
}

export interface BookDetail extends Book {
  isbn?: string | null;
  publisher?: Publisher | null;
  tags?: Tag[];
  description: string;
  additional_images: string[];
  pages?: number | null;
  edition?: string;
  publication_date?: string | null;
  sku: string;
  view_count: number;
  sale_count: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
}
