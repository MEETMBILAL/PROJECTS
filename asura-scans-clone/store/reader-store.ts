"use client";

import { create } from "zustand";

type ReadingMode = "strip" | "paginated";
type ReaderBackground = "black" | "charcoal" | "paper";
type ImageQuality = "auto" | "high" | "data-saver";

type ReaderState = {
  readingMode: ReadingMode;
  background: ReaderBackground;
  imageQuality: ImageQuality;
  currentPage: number;
  setReadingMode: (mode: ReadingMode) => void;
  setBackground: (background: ReaderBackground) => void;
  setImageQuality: (quality: ImageQuality) => void;
  setCurrentPage: (page: number) => void;
};

export const useReaderStore = create<ReaderState>((set) => ({
  readingMode: "strip",
  background: "black",
  imageQuality: "auto",
  currentPage: 0,
  setReadingMode: (readingMode) => set({ readingMode }),
  setBackground: (background) => set({ background }),
  setImageQuality: (imageQuality) => set({ imageQuality }),
  setCurrentPage: (currentPage) => set({ currentPage })
}));
