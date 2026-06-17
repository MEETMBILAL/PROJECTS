import { apiClient, unwrap } from "./client";
import type { Cart, CouponResult } from "@/types/cart";

export const cartApi = {
  get: () => unwrap<Cart>(apiClient.get("/cart/")),

  add: (bookId: number, quantity = 1) =>
    unwrap<Cart>(apiClient.post("/cart/add/", { book_id: bookId, quantity })),

  update: (itemId: number, quantity: number) =>
    unwrap<Cart>(apiClient.patch(`/cart/update/${itemId}/`, { quantity })),

  remove: (itemId: number) =>
    unwrap<Cart>(apiClient.delete(`/cart/remove/${itemId}/`)),

  clear: () => unwrap<Cart>(apiClient.delete("/cart/clear/")),

  applyCoupon: (couponCode: string) =>
    unwrap<CouponResult>(
      apiClient.post("/cart/apply-coupon/", { coupon_code: couponCode }),
    ),
};
