export const SITE = {
  name: "Asura Scans",
  shortName: "Asura",
  tagline: "Read the latest manhwa, manga & manhua — free, in stunning quality.",
  description:
    "A blazing-fast manga, manhwa and manhua reading platform. Track your favorites, get the latest chapters, and read in a beautiful dark reader.",
  themeColor: "#913FE2",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/bookmarks", label: "Bookmarks" },
  { href: "/browse", label: "Browse" },
];

export const RESOURCE_LINKS = [
  { href: "/browse?type=MANGA", label: "Novels" },
  { href: "/browse?type=MANHWA", label: "Comics" },
  { href: "/leaderboard", label: "Users / Leaderboard" },
];

export const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "https://discord.com", label: "Discord", external: true },
  { href: "https://twitter.com", label: "Twitter", external: true },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/dmca", label: "DMCA" },
];

/** Genres used across seed + filters. */
export const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Isekai",
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
] as const;

export const PAGE_SIZE = 24;
