import { create } from 'zustand';

type BookmarkState = {
  bookmarkedSlugs: Set<string>;
  toggle: (slug: string) => boolean;
  has: (slug: string) => boolean;
};

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarkedSlugs: new Set<string>(),
  toggle(slug) {
    const next = new Set(get().bookmarkedSlugs);
    const exists = next.has(slug);
    if (exists) next.delete(slug);
    else next.add(slug);
    set({ bookmarkedSlugs: next });
    return !exists;
  },
  has(slug) {
    return get().bookmarkedSlugs.has(slug);
  },
}));
