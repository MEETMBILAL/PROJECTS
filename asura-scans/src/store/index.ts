import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ReaderSettings {
  imageQuality: "low" | "medium" | "high";
  backgroundColor: string;
  readingMode: "longstrip" | "paginated";
}

interface ReaderStore extends ReaderSettings {
  setImageQuality: (quality: ReaderSettings["imageQuality"]) => void;
  setBackgroundColor: (color: string) => void;
  setReadingMode: (mode: ReaderSettings["readingMode"]) => void;
}

export const useReaderStore = create<ReaderStore>()(
  persist(
    (set) => ({
      imageQuality: "high",
      backgroundColor: "#000000",
      readingMode: "longstrip",
      setImageQuality: (imageQuality) => set({ imageQuality }),
      setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
      setReadingMode: (readingMode) => set({ readingMode }),
    }),
    { name: "asura-reader-settings" }
  )
);

interface SearchStore {
  isOpen: boolean;
  query: string;
  openSearch: () => void;
  closeSearch: () => void;
  setQuery: (query: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  isOpen: false,
  query: "",
  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ isOpen: false, query: "" }),
  setQuery: (query) => set({ query }),
}));

interface BrowseStore {
  filters: {
    genres: string[];
    status: string[];
    type: string[];
    sort: string;
  };
  setFilter: (key: string, value: string[]) => void;
  setSort: (sort: string) => void;
  removeFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}

export const useBrowseStore = create<BrowseStore>((set) => ({
  filters: { genres: [], status: [], type: [], sort: "latest" },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  setSort: (sort) =>
    set((state) => ({
      filters: { ...state.filters, sort },
    })),
  removeFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: (state.filters[key as keyof typeof state.filters] as string[]).filter(
          (v) => v !== value
        ),
      },
    })),
  clearFilters: () =>
    set({ filters: { genres: [], status: [], type: [], sort: "latest" } }),
}));
