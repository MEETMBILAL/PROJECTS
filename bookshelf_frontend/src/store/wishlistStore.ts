import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Book } from "@/types";

interface WishlistState {
  items: Book[];
  toggle: (book: Book) => void;
  remove: (bookId: number) => void;
  has: (bookId: number) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (book) =>
        set((state) => {
          const exists = state.items.some((item) => item.id === book.id);
          return {
            items: exists
              ? state.items.filter((item) => item.id !== book.id)
              : [...state.items, book],
          };
        }),
      remove: (bookId) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== bookId) })),
      has: (bookId) => get().items.some((item) => item.id === bookId),
      clear: () => set({ items: [] }),
    }),
    { name: "bookshelf-wishlist" },
  ),
);
