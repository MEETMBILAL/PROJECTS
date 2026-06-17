import { apiClient, unwrap } from "./client";
import type { ApiEnvelope } from "@/types/api";
import type { Cart } from "@/types/cart";

export const cartApi = {
  get: () => unwrap<Cart>(apiClient.get<ApiEnvelope<Cart>>("/cart/")),

  add: (bookId: number, quantity = 1) =>
    unwrap<Cart>(
      apiClient.post<ApiEnvelope<Cart>>("/cart/add/", {
        book_id: bookId,
        quantity,
      }),
    ),

  update: (itemId: number, quantity: number) =>
    unwrap<Cart>(
      apiClient.patch<ApiEnvelope<Cart>>(`/cart/update/${itemId}/`, {
        quantity,
      }),
    ),

  remove: (itemId: number) =>
    unwrap<Cart>(
      apiClient.delete<ApiEnvelope<Cart>>(`/cart/remove/${itemId}/`),
    ),

  clear: () =>
    unwrap<Cart>(apiClient.delete<ApiEnvelope<Cart>>("/cart/clear/")),
};
