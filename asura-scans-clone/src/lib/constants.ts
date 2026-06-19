export const SITE = {
  name: "Asura Scans",
  tagline: "Read the latest manga, manhwa & manhua — free, in stunning quality.",
  description:
    "Asura Scans — a community manga, manhwa and manhua reading platform. Discover trending titles, track your bookmarks and read in a clean dark reader.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  themeColor: "#913FE2",
};

export const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Isekai",
  "Magic",
  "Manhwa",
  "Martial Arts",
  "Mystery",
  "Psychological",
  "Regression",
  "Romance",
  "School Life",
  "Sci-Fi",
  "Seinen",
  "Shounen",
  "Slice of Life",
  "Supernatural",
  "System",
  "Thriller",
  "Tower",
  "Villain",
] as const;

export const COMIC_STATUS = ["ONGOING", "COMPLETED", "HIATUS"] as const;
export const COMIC_TYPE = ["MANGA", "MANHWA", "MANHUA"] as const;

export const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "az", label: "A-Z" },
  { value: "rating", label: "Rating" },
  { value: "views", label: "Views" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const PAGE_SIZE = 24;
