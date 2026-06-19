"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReadingMode = "longstrip" | "paginated";
export type ImageQuality = "high" | "medium" | "low";
export type ReaderBg = "#000000" | "#0F0F0F" | "#1A1A1A" | "#2A2A2A";

interface ReaderStore {
  mode: ReadingMode;
  quality: ImageQuality;
  background: ReaderBg;
  progress: Record<string, number>; // `${slug}:${chapter}` -> last page index
  setMode: (mode: ReadingMode) => void;
  setQuality: (q: ImageQuality) => void;
  setBackground: (bg: ReaderBg) => void;
}

export const useReaderStore = create<ReaderStore>()(
  persist(
    (set) => ({
      mode: "longstrip",
      quality: "high",
      background: "#000000",
      progress: {},
      setMode: (mode) => set({ mode }),
      setQuality: (quality) => set({ quality }),
      setBackground: (background) => set({ background }),
    }),
    { name: "asura-reader-settings" },
  ),
);
