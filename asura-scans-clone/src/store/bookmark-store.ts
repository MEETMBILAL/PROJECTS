"use client";

import { create } from "zustand";

interface BookmarkState {
  bookmarkedIds: Set<string>;
  setInitial: (ids: string[]) => void;
  add: (comicId: string) => void;
  remove: (comicId: string) => void;
  has: (comicId: string) => boolean;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarkedIds: new Set<string>(),
  setInitial: (ids) => set({ bookmarkedIds: new Set(ids) }),
  add: (comicId) =>
    set((s) => {
      const next = new Set(s.bookmarkedIds);
      next.add(comicId);
      return { bookmarkedIds: next };
    }),
  remove: (comicId) =>
    set((s) => {
      const next = new Set(s.bookmarkedIds);
      next.delete(comicId);
      return { bookmarkedIds: next };
    }),
  has: (comicId) => get().bookmarkedIds.has(comicId),
}));
