import type { ComicStatus, ComicType, ComicSort } from "./types";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Bookmarks", href: "/bookmarks" },
  { label: "Browse", href: "/browse" },
] as const;

export const RESOURCE_LINKS = [
  { label: "Novels", href: "/browse?type=NOVEL" },
  { label: "Comics", href: "/browse" },
  { label: "Users / Leaderboard", href: "/leaderboard" },
] as const;

export const STATUS_OPTIONS: { label: string; value: ComicStatus | "ALL" }[] = [
  { label: "All Status", value: "ALL" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Hiatus", value: "HIATUS" },
];

export const TYPE_OPTIONS: { label: string; value: ComicType | "ALL" }[] = [
  { label: "All Types", value: "ALL" },
  { label: "Manga", value: "MANGA" },
  { label: "Manhwa", value: "MANHWA" },
  { label: "Manhua", value: "MANHUA" },
];

export const SORT_OPTIONS: { label: string; value: ComicSort }[] = [
  { label: "Latest", value: "latest" },
  { label: "A-Z", value: "az" },
  { label: "Rating", value: "rating" },
  { label: "Views", value: "views" },
];

export const SITE = {
  name: "Asura Scans",
  tagline: "Read the latest manhwa, manga & manhua — free and ad-light.",
  description:
    "Asura Scans clone — read thousands of manga, manhwa, and manhua chapters with a fast, modern dark reader.",
  discord: "https://discord.com",
  twitter: "https://twitter.com",
} as const;
