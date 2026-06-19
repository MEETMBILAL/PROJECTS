import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ReaderSettings {
  imageQuality: "low" | "medium" | "high";
  backgroundColor: string;
  readingMode: "long-strip" | "paginated";
}

interface ReaderState extends ReaderSettings {
  setImageQuality: (quality: ReaderSettings["imageQuality"]) => void;
  setBackgroundColor: (color: string) => void;
  setReadingMode: (mode: ReaderSettings["readingMode"]) => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      imageQuality: "high",
      backgroundColor: "#000000",
      readingMode: "long-strip",
      setImageQuality: (imageQuality) => set({ imageQuality }),
      setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
      setReadingMode: (readingMode) => set({ readingMode }),
    }),
    { name: "asura-reader-settings" }
  )
);
