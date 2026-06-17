import type { BookListItem } from "./book";

export interface CartItem {
  id: number;
  book: BookListItem;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: string;
  total_items: number;
}

export interface CouponResult {
  coupon_code: string;
  discount: string;
  subtotal: string;
  total: string;
}
