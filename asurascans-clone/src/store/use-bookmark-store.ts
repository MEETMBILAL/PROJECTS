"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookmarkState {
  /** Map of comic slug -> last read chapter number (0 if not started). */
  bookmarks: Record<string, number>;
  add: (slug: string, lastRead?: number) => void;
  remove: (slug: string) => void;
  toggle: (slug: string) => void;
  setLastRead: (slug: string, chapter: number) => void;
  isBookmarked: (slug: string) => boolean;
}

/**
 * Client-side bookmark store with optimistic UI. Persists to localStorage so
 * the demo works for anonymous users; when authenticated the bookmarks API is
 * used as the source of truth and this mirrors it.
 */
export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: {},
      add: (slug, lastRead = 0) =>
        set((s) => ({ bookmarks: { ...s.bookmarks, [slug]: lastRead } })),
      remove: (slug) =>
        set((s) => {
          const next = { ...s.bookmarks };
          delete next[slug];
          return { bookmarks: next };
        }),
      toggle: (slug) =>
        get().isBookmarked(slug) ? get().remove(slug) : get().add(slug),
      setLastRead: (slug, chapter) =>
        set((s) => ({
          bookmarks: {
            ...s.bookmarks,
            [slug]: Math.max(chapter, s.bookmarks[slug] ?? 0),
          },
        })),
      isBookmarked: (slug) => slug in get().bookmarks,
    }),
    { name: "asura-bookmarks" }
  )
);
