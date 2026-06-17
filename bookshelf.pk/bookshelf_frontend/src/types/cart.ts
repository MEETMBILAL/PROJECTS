import type { Book } from "./book";

export interface CartItem {
  id: number;
  book: Book;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: string;
  total_items: number;
  updated_at: string;
}

export interface CouponResult {
  code: string;
  discount: string;
  subtotal: string;
  total_after_discount: string;
}
