"use client";

import { create } from "zustand";

type BookmarkState = {
  optimisticBookmarks: Set<string>;
  toggle: (comicId: string) => void;
  remove: (comicId: string) => void;
};

export const useBookmarkStore = create<BookmarkState>((set) => ({
  optimisticBookmarks: new Set<string>(),
  toggle: (comicId) =>
    set((state) => {
      const next = new Set(state.optimisticBookmarks);
      if (next.has(comicId)) {
        next.delete(comicId);
      } else {
        next.add(comicId);
      }
      return { optimisticBookmarks: next };
    }),
  remove: (comicId) =>
    set((state) => {
      const next = new Set(state.optimisticBookmarks);
      next.delete(comicId);
      return { optimisticBookmarks: next };
    })
}));
