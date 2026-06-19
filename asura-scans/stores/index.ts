import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ReaderSettings {
  imageQuality: "low" | "medium" | "high";
  backgroundColor: string;
  readingMode: "strip" | "paginated";
  setImageQuality: (q: "low" | "medium" | "high") => void;
  setBackgroundColor: (color: string) => void;
  setReadingMode: (mode: "strip" | "paginated") => void;
}

export const useReaderStore = create<ReaderSettings>()(
  persist(
    (set) => ({
      imageQuality: "high",
      backgroundColor: "#000000",
      readingMode: "strip",
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
  open: () => void;
  close: () => void;
  setQuery: (query: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  isOpen: false,
  query: "",
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, query: "" }),
  setQuery: (query) => set({ query }),
}));

interface NavbarStore {
  scrolled: boolean;
  mobileOpen: boolean;
  setScrolled: (scrolled: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

export const useNavbarStore = create<NavbarStore>((set) => ({
  scrolled: false,
  mobileOpen: false,
  setScrolled: (scrolled) => set({ scrolled }),
  setMobileOpen: (mobileOpen) => set({ mobileOpen }),
}));
