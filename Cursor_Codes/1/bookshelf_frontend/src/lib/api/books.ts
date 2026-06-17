import { apiClient, unwrap } from "./client";
import type { ApiEnvelope, Paginated } from "@/types/api";
import type {
  Author,
  Book,
  BookDetail,
  Category,
  SearchResults,
} from "@/types/book";

export interface BookQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  author?: string;
  publisher?: string;
  tag?: string;
  min_price?: number;
  max_price?: number;
  language?: string;
  format?: string;
  min_rating?: number;
  in_stock?: boolean;
  featured?: boolean;
  bestseller?: boolean;
  new_arrival?: boolean;
  sort?: string;
  [key: string]: string | number | boolean | undefined;
}

export const booksApi = {
  list: (params: BookQueryParams = {}) =>
    unwrap<Paginated<Book>>(
      apiClient.get<ApiEnvelope<Paginated<Book>>>("/books/", { params }),
    ),

  detail: (slug: string) =>
    unwrap<BookDetail>(
      apiClient.get<ApiEnvelope<BookDetail>>(`/books/${slug}/`),
    ),

  related: (slug: string) =>
    unwrap<Book[]>(
      apiClient.get<ApiEnvelope<Book[]>>(`/books/${slug}/related/`),
    ),

  featured: () =>
    unwrap<Book[]>(apiClient.get<ApiEnvelope<Book[]>>("/books/featured/")),

  bestsellers: () =>
    unwrap<Book[]>(apiClient.get<ApiEnvelope<Book[]>>("/books/bestsellers/")),

  newArrivals: () =>
    unwrap<Book[]>(
      apiClient.get<ApiEnvelope<Book[]>>("/books/new-arrivals/"),
    ),

  categories: () =>
    unwrap<Category[]>(
      apiClient.get<ApiEnvelope<Category[]>>("/categories/"),
    ),

  category: (slug: string) =>
    unwrap<Category>(
      apiClient.get<ApiEnvelope<Category>>(`/categories/${slug}/`),
    ),

  authors: () =>
    unwrap<Paginated<Author>>(
      apiClient.get<ApiEnvelope<Paginated<Author>>>("/authors/"),
    ),

  author: (slug: string) =>
    unwrap<Author>(apiClient.get<ApiEnvelope<Author>>(`/authors/${slug}/`)),

  search: (q: string) =>
    unwrap<SearchResults>(
      apiClient.get<ApiEnvelope<SearchResults>>("/search/", {
        params: { q },
      }),
    ),
};
