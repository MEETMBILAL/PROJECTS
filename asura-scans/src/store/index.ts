"use client";

import { create } from "zustand";

interface SearchStore {
  isOpen: boolean;
  query: string;
  open: () => void;
  close: () => void;
  setQuery: (q: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  isOpen: false,
  query: "",
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, query: "" }),
  setQuery: (query) => set({ query }),
}));

interface ReaderSettings {
  imageQuality: "low" | "medium" | "high";
  backgroundColor: string;
  readingMode: "strip" | "paginated";
  setImageQuality: (q: "low" | "medium" | "high") => void;
  setBackgroundColor: (c: string) => void;
  setReadingMode: (m: "strip" | "paginated") => void;
}

export const useReaderStore = create<ReaderSettings>((set) => ({
  imageQuality: "high",
  backgroundColor: "#000000",
  readingMode: "strip",
  setImageQuality: (imageQuality) => set({ imageQuality }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setReadingMode: (readingMode) => set({ readingMode }),
}));

interface BookmarkStore {
  bookmarkedSlugs: Set<string>;
  setBookmarked: (slugs: string[]) => void;
  addBookmark: (slug: string) => void;
  removeBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
  bookmarkedSlugs: new Set(),
  setBookmarked: (slugs) => set({ bookmarkedSlugs: new Set(slugs) }),
  addBookmark: (slug) =>
    set((s) => {
      const next = new Set(s.bookmarkedSlugs);
      next.add(slug);
      return { bookmarkedSlugs: next };
    }),
  removeBookmark: (slug) =>
    set((s) => {
      const next = new Set(s.bookmarkedSlugs);
      next.delete(slug);
      return { bookmarkedSlugs: next };
    }),
  isBookmarked: (slug) => get().bookmarkedSlugs.has(slug),
}));
