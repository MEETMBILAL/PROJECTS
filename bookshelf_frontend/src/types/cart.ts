import type { Book } from "./book";

export interface CartItem {
  id: number;
  book: Book;
  quantity: number;
  line_total: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: string;
  item_count: number;
  created_at: string;
}
