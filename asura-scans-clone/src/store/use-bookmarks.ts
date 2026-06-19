"use client";

import { create } from "zustand";

interface BookmarkState {
  /** Set of comicIds the current user has bookmarked (optimistic mirror). */
  bookmarked: Set<string>;
  setInitial: (ids: string[]) => void;
  add: (comicId: string) => void;
  remove: (comicId: string) => void;
  toggleLocal: (comicId: string) => boolean;
  has: (comicId: string) => boolean;
}

export const useBookmarks = create<BookmarkState>((set, get) => ({
  bookmarked: new Set<string>(),
  setInitial: (ids) => set({ bookmarked: new Set(ids) }),
  add: (comicId) =>
    set((state) => {
      const next = new Set(state.bookmarked);
      next.add(comicId);
      return { bookmarked: next };
    }),
  remove: (comicId) =>
    set((state) => {
      const next = new Set(state.bookmarked);
      next.delete(comicId);
      return { bookmarked: next };
    }),
  toggleLocal: (comicId) => {
    const has = get().bookmarked.has(comicId);
    if (has) get().remove(comicId);
    else get().add(comicId);
    return !has;
  },
  has: (comicId) => get().bookmarked.has(comicId),
}));
