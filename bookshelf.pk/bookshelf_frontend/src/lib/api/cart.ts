import { apiClient, unwrap } from "./client";
import type { ApiEnvelope } from "@/types/api";
import type { Cart, CouponResult } from "@/types/cart";

export const cartApi = {
  async get(): Promise<Cart> {
    const { data } = await apiClient.get<ApiEnvelope<Cart>>("/cart/");
    return unwrap(data);
  },

  async add(bookId: number, quantity = 1): Promise<Cart> {
    const { data } = await apiClient.post<ApiEnvelope<Cart>>("/cart/add/", {
      book_id: bookId,
      quantity,
    });
    return unwrap(data);
  },

  async update(itemId: number, quantity: number): Promise<Cart> {
    const { data } = await apiClient.patch<ApiEnvelope<Cart>>(
      `/cart/update/${itemId}/`,
      { quantity },
    );
    return unwrap(data);
  },

  async remove(itemId: number): Promise<Cart> {
    const { data } = await apiClient.delete<ApiEnvelope<Cart>>(
      `/cart/remove/${itemId}/`,
    );
    return unwrap(data);
  },

  async clear(): Promise<Cart> {
    const { data } = await apiClient.delete<ApiEnvelope<Cart>>("/cart/clear/");
    return unwrap(data);
  },

  async applyCoupon(code: string): Promise<CouponResult> {
    const { data } = await apiClient.post<ApiEnvelope<CouponResult>>(
      "/cart/apply-coupon/",
      { code },
    );
    return unwrap(data);
  },
};
