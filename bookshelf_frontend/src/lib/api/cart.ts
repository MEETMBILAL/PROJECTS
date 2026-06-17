import { apiClient } from "./client";
import type { ApiResponse, Cart } from "@/types";

export const cartApi = {
  async get(): Promise<Cart> {
    const { data } = await apiClient.get<ApiResponse<Cart>>("/cart/");
    return data.data;
  },

  async add(bookId: number, quantity = 1): Promise<Cart> {
    const { data } = await apiClient.post<ApiResponse<Cart>>("/cart/add/", {
      book_id: bookId,
      quantity,
    });
    return data.data;
  },

  async update(itemId: number, quantity: number): Promise<Cart> {
    const { data } = await apiClient.patch<ApiResponse<Cart>>(`/cart/update/${itemId}/`, {
      quantity,
    });
    return data.data;
  },

  async remove(itemId: number): Promise<Cart> {
    const { data } = await apiClient.delete<ApiResponse<Cart>>(`/cart/remove/${itemId}/`);
    return data.data;
  },

  async clear(): Promise<void> {
    await apiClient.delete("/cart/clear/");
  },

  async applyCoupon(
    code: string,
    orderAmount: number,
  ): Promise<{ discount: string; total_after_discount: string }> {
    const { data } = await apiClient.post<
      ApiResponse<{ discount: string; total_after_discount: string }>
    >("/cart/apply-coupon/", { code, order_amount: orderAmount });
    return data.data;
  },
};
