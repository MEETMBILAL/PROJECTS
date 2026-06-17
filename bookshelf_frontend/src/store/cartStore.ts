import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Book } from "@/types";

export interface LocalCartItem {
  book: Book;
  quantity: number;
}

interface CartState {
  items: LocalCartItem[];
  addItem: (book: Book, quantity?: number) => void;
  removeItem: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clear: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (book, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.book.id === book.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.book.id === book.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }
          return { items: [...state.items, { book, quantity }] };
        }),
      removeItem: (bookId) =>
        set((state) => ({
          items: state.items.filter((item) => item.book.id !== bookId),
        })),
      updateQuantity: (bookId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.book.id !== bookId)
              : state.items.map((item) =>
                  item.book.id === bookId ? { ...item, quantity } : item,
                ),
        })),
      clear: () => set({ items: [] }),
      itemCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      subtotal: () =>
        get().items.reduce(
          (acc, item) => acc + parseFloat(item.book.effective_price) * item.quantity,
          0,
        ),
    }),
    { name: "bookshelf-cart" },
  ),
);
