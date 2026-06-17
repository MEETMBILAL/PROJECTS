import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: number[];
  toggle: (bookId: number) => void;
  add: (bookId: number) => void;
  remove: (bookId: number) => void;
  has: (bookId: number) => boolean;
  setIds: (ids: number[]) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (bookId) =>
        set((state) => ({
          ids: state.ids.includes(bookId)
            ? state.ids.filter((id) => id !== bookId)
            : [...state.ids, bookId],
        })),
      add: (bookId) =>
        set((state) => ({
          ids: state.ids.includes(bookId) ? state.ids : [...state.ids, bookId],
        })),
      remove: (bookId) =>
        set((state) => ({ ids: state.ids.filter((id) => id !== bookId) })),
      has: (bookId) => get().ids.includes(bookId),
      setIds: (ids) => set({ ids }),
      clear: () => set({ ids: [] }),
    }),
    { name: "bookshelf-wishlist" },
  ),
);
