import { apiClient, unwrap } from "./client";
import type { ApiEnvelope, Paginated } from "@/types/api";
import type {
  Author,
  Book,
  BookDetail,
  Category,
} from "@/types/book";

export interface BookQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  author?: string;
  min_price?: number;
  max_price?: number;
  language?: string;
  format?: string;
  min_rating?: number;
  in_stock?: boolean;
  on_sale?: boolean;
  sort?: string;
}

export interface SearchResult {
  query: string;
  books: Book[];
  authors: Author[];
  categories: Category[];
}

export const booksApi = {
  async list(params: BookQueryParams = {}): Promise<Paginated<Book>> {
    const { data } = await apiClient.get<ApiEnvelope<Paginated<Book>>>(
      "/books/",
      { params },
    );
    return unwrap(data);
  },

  async detail(slug: string): Promise<BookDetail> {
    const { data } = await apiClient.get<ApiEnvelope<BookDetail>>(
      `/books/${slug}/`,
    );
    return unwrap(data);
  },

  async related(slug: string): Promise<Book[]> {
    const { data } = await apiClient.get<ApiEnvelope<Book[]>>(
      `/books/${slug}/related/`,
    );
    return unwrap(data);
  },

  async featured(): Promise<Paginated<Book>> {
    const { data } = await apiClient.get<ApiEnvelope<Paginated<Book>>>(
      "/books/featured/",
    );
    return unwrap(data);
  },

  async bestsellers(): Promise<Paginated<Book>> {
    const { data } = await apiClient.get<ApiEnvelope<Paginated<Book>>>(
      "/books/bestsellers/",
    );
    return unwrap(data);
  },

  async newArrivals(): Promise<Paginated<Book>> {
    const { data } = await apiClient.get<ApiEnvelope<Paginated<Book>>>(
      "/books/new-arrivals/",
    );
    return unwrap(data);
  },

  async categories(): Promise<Category[]> {
    const { data } = await apiClient.get<ApiEnvelope<Category[]>>(
      "/categories/",
    );
    return unwrap(data);
  },

  async category(slug: string): Promise<Category> {
    const { data } = await apiClient.get<ApiEnvelope<Category>>(
      `/categories/${slug}/`,
    );
    return unwrap(data);
  },

  async categoryBooks(slug: string): Promise<Paginated<Book>> {
    const { data } = await apiClient.get<ApiEnvelope<Paginated<Book>>>(
      `/categories/${slug}/books/`,
    );
    return unwrap(data);
  },

  async authors(): Promise<Paginated<Author>> {
    const { data } = await apiClient.get<ApiEnvelope<Paginated<Author>>>(
      "/authors/",
    );
    return unwrap(data);
  },

  async author(slug: string): Promise<Author> {
    const { data } = await apiClient.get<ApiEnvelope<Author>>(
      `/authors/${slug}/`,
    );
    return unwrap(data);
  },

  async authorBooks(slug: string): Promise<Paginated<Book>> {
    const { data } = await apiClient.get<ApiEnvelope<Paginated<Book>>>(
      `/authors/${slug}/books/`,
    );
    return unwrap(data);
  },

  async search(q: string): Promise<SearchResult> {
    const { data } = await apiClient.get<ApiEnvelope<SearchResult>>(
      "/search/",
      { params: { q } },
    );
    return unwrap(data);
  },
};
