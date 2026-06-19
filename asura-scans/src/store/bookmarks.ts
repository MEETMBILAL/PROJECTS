"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ComicCardDTO } from "@/lib/types";

export interface BookmarkEntry {
  comic: ComicCardDTO;
  lastReadChapter: number | null;
  addedAt: number;
}

interface BookmarkStore {
  bookmarks: Record<string, BookmarkEntry>;
  isBookmarked: (slug: string) => boolean;
  add: (comic: ComicCardDTO) => void;
  remove: (slug: string) => void;
  toggle: (comic: ComicCardDTO) => boolean;
  setLastRead: (slug: string, chapter: number) => void;
  list: () => BookmarkEntry[];
}

/**
 * Client-side bookmark store with optimistic updates, persisted to
 * localStorage. When authenticated, it is synced with the server bookmark API,
 * but it works fully offline / unauthenticated for the demo.
 */
export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: {},
      isBookmarked: (slug) => Boolean(get().bookmarks[slug]),
      add: (comic) =>
        set((s) => ({
          bookmarks: {
            ...s.bookmarks,
            [comic.slug]: {
              comic,
              lastReadChapter: s.bookmarks[comic.slug]?.lastReadChapter ?? null,
              addedAt: Date.now(),
            },
          },
        })),
      remove: (slug) =>
        set((s) => {
          const next = { ...s.bookmarks };
          delete next[slug];
          return { bookmarks: next };
        }),
      toggle: (comic) => {
        const exists = get().isBookmarked(comic.slug);
        if (exists) get().remove(comic.slug);
        else get().add(comic);
        return !exists;
      },
      setLastRead: (slug, chapter) =>
        set((s) => {
          const entry = s.bookmarks[slug];
          if (!entry) return s;
          return {
            bookmarks: {
              ...s.bookmarks,
              [slug]: {
                ...entry,
                lastReadChapter: Math.max(entry.lastReadChapter ?? 0, chapter),
              },
            },
          };
        }),
      list: () =>
        Object.values(get().bookmarks).sort((a, b) => b.addedAt - a.addedAt),
    }),
    { name: "asura-bookmarks" },
  ),
);
