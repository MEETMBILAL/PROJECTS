import { apiClient, unwrap } from "./client";
import type { ApiEnvelope } from "@/types/api";
import type { Book } from "@/types/book";

export interface WishlistItem {
  id: number;
  book: Book;
  created_at: string;
}

export const wishlistApi = {
  async list(): Promise<WishlistItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<WishlistItem[]>>(
      "/wishlist/",
    );
    return unwrap(data);
  },

  async add(bookId: number): Promise<WishlistItem> {
    const { data } = await apiClient.post<ApiEnvelope<WishlistItem>>(
      "/wishlist/add/",
      { book_id: bookId },
    );
    return unwrap(data);
  },

  async remove(bookId: number): Promise<void> {
    await apiClient.delete(`/wishlist/remove/${bookId}/`);
  },
};
