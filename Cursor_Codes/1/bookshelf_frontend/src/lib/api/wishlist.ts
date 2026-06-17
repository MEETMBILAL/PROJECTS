import { apiClient, unwrap } from "./client";
import type { ApiEnvelope } from "@/types/api";
import type { Book } from "@/types/book";

export interface WishlistItem {
  id: number;
  book: Book;
  created_at: string;
}

export const wishlistApi = {
  list: () =>
    unwrap<WishlistItem[]>(
      apiClient.get<ApiEnvelope<WishlistItem[]>>("/wishlist/"),
    ),

  add: (bookId: number) =>
    unwrap<WishlistItem>(
      apiClient.post<ApiEnvelope<WishlistItem>>("/wishlist/add/", {
        book_id: bookId,
      }),
    ),

  remove: (bookId: number) =>
    apiClient.delete(`/wishlist/remove/${bookId}/`),
};
