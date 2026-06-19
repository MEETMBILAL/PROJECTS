import { create } from "zustand";

type BookmarkState = {
  bookmarkedIds: Set<string>;
  toggleLocal: (comicId: string) => void;
  has: (comicId: string) => boolean;
};

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarkedIds: new Set<string>(),
  toggleLocal: (comicId) => {
    const next = new Set(get().bookmarkedIds);
    if (next.has(comicId)) next.delete(comicId);
    else next.add(comicId);
    set({ bookmarkedIds: next });
  },
  has: (comicId) => get().bookmarkedIds.has(comicId),
}));
