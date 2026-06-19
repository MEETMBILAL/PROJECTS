"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReadingMode = "longstrip" | "paginated";
export type ImageQuality = "high" | "medium" | "low";

interface ReaderSettingsState {
  mode: ReadingMode;
  quality: ImageQuality;
  background: string;
  maxWidth: number;
  setMode: (mode: ReadingMode) => void;
  setQuality: (quality: ImageQuality) => void;
  setBackground: (bg: string) => void;
  setMaxWidth: (w: number) => void;
}

export const useReaderSettings = create<ReaderSettingsState>()(
  persist(
    (set) => ({
      mode: "longstrip",
      quality: "high",
      background: "#000000",
      maxWidth: 800,
      setMode: (mode) => set({ mode }),
      setQuality: (quality) => set({ quality }),
      setBackground: (background) => set({ background }),
      setMaxWidth: (maxWidth) => set({ maxWidth }),
    }),
    { name: "asura-reader-settings" },
  ),
);
