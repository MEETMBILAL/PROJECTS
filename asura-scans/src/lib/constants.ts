import type { ComicStatus, ComicType } from "./types";

export const SITE = {
  name: "Asura Scans",
  shortName: "Asura",
  description:
    "Read the latest manhwa, manga and manhua. Official translations, daily updates, and a massive library — all on Asura Scans.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  themeColor: "#913FE2",
  twitter: "https://twitter.com",
  discord: "https://discord.com",
};

export const STATUS_OPTIONS: { value: ComicStatus; label: string }[] = [
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "HIATUS", label: "Hiatus" },
];

export const TYPE_OPTIONS: { value: ComicType; label: string }[] = [
  { value: "MANGA", label: "Manga" },
  { value: "MANHWA", label: "Manhwa" },
  { value: "MANHUA", label: "Manhua" },
];

export const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "az", label: "A-Z" },
  { value: "rating", label: "Rating" },
  { value: "views", label: "Views" },
] as const;

export const GENRE_NAMES = [
  "Action",
  "Adventure",
  "Fantasy",
  "Romance",
  "Drama",
  "Comedy",
  "System",
  "Regression",
  "Isekai",
  "Murim",
  "Cultivation",
  "Supernatural",
  "Sci-fi",
  "Tragedy",
  "Horror",
  "Mystery",
  "Psychological",
  "Slice of Life",
  "Manhwa",
  "Revenge",
];
