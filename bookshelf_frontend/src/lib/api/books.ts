import { apiClient, unwrap } from "./client";
import type { Paginated } from "@/types/api";
import type {
  Author,
  Book,
  BookListItem,
  Category,
  SearchResults,
} from "@/types/book";

export type BookQueryParams = Record<string, string | number | boolean | undefined>;

function cleanParams(params: BookQueryParams = {}): BookQueryParams {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== null),
  );
}

export const booksApi = {
  list: (params: BookQueryParams = {}) =>
    unwrap<Paginated<BookListItem>>(
      apiClient.get("/books/", { params: cleanParams(params) }),
    ),

  detail: (slug: string) => unwrap<Book>(apiClient.get(`/books/${slug}/`)),

  related: (slug: string) =>
    unwrap<BookListItem[]>(apiClient.get(`/books/${slug}/related/`)),

  featured: () => unwrap<BookListItem[]>(apiClient.get("/books/featured/")),

  bestsellers: () => unwrap<BookListItem[]>(apiClient.get("/books/bestsellers/")),

  newArrivals: () =>
    unwrap<BookListItem[]>(apiClient.get("/books/new-arrivals/")),

  categories: () => unwrap<Category[]>(apiClient.get("/categories/")),

  category: (slug: string) =>
    unwrap<Category>(apiClient.get(`/categories/${slug}/`)),

  authors: () =>
    unwrap<Paginated<Author>>(apiClient.get("/authors/")),

  author: (slug: string) => unwrap<Author>(apiClient.get(`/authors/${slug}/`)),

  authorBooks: (slug: string) =>
    unwrap<BookListItem[]>(apiClient.get(`/authors/${slug}/books/`)),

  search: (q: string, params: BookQueryParams = {}) =>
    unwrap<SearchResults>(
      apiClient.get("/search/", { params: cleanParams({ q, ...params }) }),
    ),
};
