"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReadingMode = "long-strip" | "paginated";
export type ImageQuality = "high" | "medium" | "low";

interface ReaderState {
  mode: ReadingMode;
  quality: ImageQuality;
  background: string;
  maxWidth: number;
  setMode: (mode: ReadingMode) => void;
  setQuality: (quality: ImageQuality) => void;
  setBackground: (color: string) => void;
  setMaxWidth: (px: number) => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      mode: "long-strip",
      quality: "high",
      background: "#000000",
      maxWidth: 800,
      setMode: (mode) => set({ mode }),
      setQuality: (quality) => set({ quality }),
      setBackground: (background) => set({ background }),
      setMaxWidth: (maxWidth) => set({ maxWidth }),
    }),
    { name: "asura-reader-settings" }
  )
);
