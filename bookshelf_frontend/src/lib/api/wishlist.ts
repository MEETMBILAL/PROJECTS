import { apiClient } from "./client";
import type { ApiResponse, Book } from "@/types";

export interface WishlistItem {
  id: number;
  book: Book;
  created_at: string;
}

export const wishlistApi = {
  async list(): Promise<WishlistItem[]> {
    const { data } = await apiClient.get<ApiResponse<WishlistItem[]>>("/wishlist/");
    return Array.isArray(data.data) ? data.data : [];
  },

  async add(bookId: number): Promise<WishlistItem> {
    const { data } = await apiClient.post<ApiResponse<WishlistItem>>("/wishlist/add/", {
      book_id: bookId,
    });
    return data.data;
  },

  async remove(bookId: number): Promise<void> {
    await apiClient.delete(`/wishlist/remove/${bookId}/`);
  },
};
