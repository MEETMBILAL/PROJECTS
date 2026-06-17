import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book } from "@/types/book";

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
          const exists = state.items.some((b) => b.id === book.id);
          return {
            items: exists
              ? state.items.filter((b) => b.id !== book.id)
              : [...state.items, book],
          };
        }),
      remove: (bookId) =>
        set((state) => ({
          items: state.items.filter((b) => b.id !== bookId),
        })),
      has: (bookId) => get().items.some((b) => b.id === bookId),
      clear: () => set({ items: [] }),
    }),
    { name: "bookshelf-wishlist" },
  ),
);
