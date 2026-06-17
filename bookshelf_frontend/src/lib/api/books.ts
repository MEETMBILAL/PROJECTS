import { apiClient } from "./client";
import type {
  ApiResponse,
  Author,
  Book,
  BookDetail,
  Category,
  PaginatedData,
} from "@/types";

export interface BookListParams {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  author?: string;
  min_price?: number;
  max_price?: number;
  language?: string;
  format?: string;
  in_stock?: boolean;
  min_rating?: number;
  ordering?: string;
}

export const booksApi = {
  async list(params: BookListParams = {}): Promise<PaginatedData<Book>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedData<Book>>>("/books/", {
      params,
    });
    return data.data;
  },

  async detail(slug: string): Promise<BookDetail> {
    const { data } = await apiClient.get<ApiResponse<BookDetail>>(`/books/${slug}/`);
    return data.data;
  },

  async featured(): Promise<Book[]> {
    const { data } = await apiClient.get<ApiResponse<Book[]>>("/books/featured/");
    return data.data;
  },

  async bestsellers(): Promise<Book[]> {
    const { data } = await apiClient.get<ApiResponse<Book[]>>("/books/bestsellers/");
    return data.data;
  },

  async newArrivals(): Promise<Book[]> {
    const { data } = await apiClient.get<ApiResponse<Book[]>>("/books/new-arrivals/");
    return data.data;
  },

  async related(slug: string): Promise<Book[]> {
    const { data } = await apiClient.get<ApiResponse<Book[]>>(`/books/${slug}/related/`);
    return data.data;
  },

  async categories(): Promise<Category[]> {
    const { data } = await apiClient.get<ApiResponse<Category[]>>("/categories/");
    return data.data;
  },

  async category(slug: string): Promise<Category> {
    const { data } = await apiClient.get<ApiResponse<Category>>(`/categories/${slug}/`);
    return data.data;
  },

  async authors(): Promise<Author[]> {
    const { data } = await apiClient.get<ApiResponse<PaginatedData<Author> | Author[]>>(
      "/authors/",
    );
    const payload = data.data;
    return Array.isArray(payload) ? payload : payload.results;
  },

  async author(slug: string): Promise<Author> {
    const { data } = await apiClient.get<ApiResponse<Author>>(`/authors/${slug}/`);
    return data.data;
  },
};
