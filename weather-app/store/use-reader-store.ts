"use client";

import { create } from "zustand";

type ReaderMode = "strip" | "paginated";
type ReaderBackground = "black" | "charcoal" | "paper";
type ImageQuality = "auto" | "high" | "data-saver";

type ReaderState = {
  mode: ReaderMode;
  pageIndex: number;
  background: ReaderBackground;
  quality: ImageQuality;
  setMode: (mode: ReaderMode) => void;
  setPageIndex: (pageIndex: number) => void;
  setBackground: (background: ReaderBackground) => void;
  setQuality: (quality: ImageQuality) => void;
};

export const useReaderStore = create<ReaderState>((set) => ({
  mode: "strip",
  pageIndex: 0,
  background: "black",
  quality: "auto",
  setMode: (mode) => set({ mode }),
  setPageIndex: (pageIndex) => set({ pageIndex }),
  setBackground: (background) => set({ background }),
  setQuality: (quality) => set({ quality }),
}));
