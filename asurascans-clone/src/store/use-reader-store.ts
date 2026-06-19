"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReadingMode = "long-strip" | "paginated";
export type ImageQuality = "auto" | "high" | "data-saver";
export type ReaderBackground = "black" | "dark" | "sepia";

interface ReaderState {
  mode: ReadingMode;
  quality: ImageQuality;
  background: ReaderBackground;
  setMode: (mode: ReadingMode) => void;
  setQuality: (quality: ImageQuality) => void;
  setBackground: (bg: ReaderBackground) => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      mode: "long-strip",
      quality: "auto",
      background: "black",
      setMode: (mode) => set({ mode }),
      setQuality: (quality) => set({ quality }),
      setBackground: (background) => set({ background }),
    }),
    { name: "asura-reader-settings" }
  )
);
