import { create } from "zustand";

interface WishlistState {
  bookIds: Set<number>;
  setBookIds: (ids: number[]) => void;
  add: (id: number) => void;
  remove: (id: number) => void;
  has: (id: number) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  bookIds: new Set<number>(),
  setBookIds: (ids) => set({ bookIds: new Set(ids) }),
  add: (id) =>
    set((state) => {
      const next = new Set(state.bookIds);
      next.add(id);
      return { bookIds: next };
    }),
  remove: (id) =>
    set((state) => {
      const next = new Set(state.bookIds);
      next.delete(id);
      return { bookIds: next };
    }),
  has: (id) => get().bookIds.has(id),
}));
