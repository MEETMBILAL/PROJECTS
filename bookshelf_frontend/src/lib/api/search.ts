import { apiClient } from "./client";
import type { ApiResponse, Author, Book, Category } from "@/types";

export interface SearchResults {
  books: Book[];
  authors: Author[];
  categories: Category[];
}

export const searchApi = {
  async global(query: string): Promise<SearchResults> {
    const { data } = await apiClient.get<ApiResponse<SearchResults>>("/search/", {
      params: { q: query },
    });
    return data.data;
  },
};
