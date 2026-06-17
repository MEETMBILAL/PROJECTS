export interface Author {
  id: number;
  name: string;
  slug: string;
  bio: string;
  photo: string;
  book_count: number;
}

export interface Publisher {
  id: number;
  name: string;
  slug: string;
  website: string;
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
  parent: number | null;
  description: string;
  image: string;
  icon: string;
  order: number;
  is_active: boolean;
  children: Category[];
  book_count: number;
}

export type BookFormat = "paperback" | "hardcover" | "ebook";

export interface BookListItem {
  id: number;
  title: string;
  slug: string;
  cover_image: string;
  authors: Author[];
  category: string | null;
  category_slug: string | null;
  original_price: string;
  sale_price: string | null;
  effective_price: string;
  currency: string;
  discount_percentage: number;
  is_on_sale: boolean;
  in_stock: boolean;
  stock: number;
  format: BookFormat;
  language: string;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  average_rating: number;
  review_count: number;
  short_description: string;
}

export interface Book extends BookListItem {
  isbn: string | null;
  publisher: Publisher | null;
  category_detail?: Category | null;
  tags: Tag[];
  description: string;
  additional_images: string[];
  pages: number | null;
  edition: string;
  publication_date: string | null;
  sku: string;
  view_count: number;
  sale_count: number;
  meta_title: string;
  meta_description: string;
  created_at: string;
}

export interface Review {
  id: number;
  book: number;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
}

export interface SearchResults {
  query: string;
  books: BookListItem[];
  authors: Author[];
  categories: Category[];
  total: number;
}
