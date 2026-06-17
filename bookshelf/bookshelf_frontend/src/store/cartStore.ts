import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book } from "@/types/book";

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
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (book, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.book.id === book.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.book.id === book.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { book, quantity }] };
        }),
      removeItem: (bookId) =>
        set((state) => ({
          items: state.items.filter((i) => i.book.id !== bookId),
        })),
      updateQuantity: (bookId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.book.id === bookId ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce(
          (sum, i) => sum + parseFloat(i.book.effective_price) * i.quantity,
          0,
        ),
    }),
    { name: "bookshelf-cart" },
  ),
);
