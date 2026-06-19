import type { Chapter, Comic, ComicStatus, ComicType, Genre } from "./types";
import { seededRandom, slugify } from "./utils";

/**
 * Deterministic, original synthetic dataset for the Asura Scans clone.
 *
 * All titles, authors and synopses below are invented for this demo so the
 * project does not reproduce any real, copyrighted manga/manhwa content. Cover
 * and page artwork use the picsum.photos placeholder service keyed by a stable
 * seed, so images are consistent across renders.
 */

export const GENRE_NAMES = [
  "Action",
  "Adventure",
  "Fantasy",
  "Romance",
  "Drama",
  "Comedy",
  "Manhwa",
  "System",
  "Regression",
  "Isekai",
  "Martial Arts",
  "Supernatural",
  "Sci-Fi",
  "Horror",
  "Mystery",
  "Slice of Life",
  "Tower",
  "Necromancer",
  "Dungeon",
  "Apocalypse",
] as const;

export const GENRES: Genre[] = GENRE_NAMES.map((name) => ({
  id: `genre_${slugify(name)}`,
  name,
  slug: slugify(name),
}));

const TITLE_ADJECTIVES = [
  "Solo",
  "Returned",
  "Reincarnated",
  "Hidden",
  "Eternal",
  "Infinite",
  "Forsaken",
  "Genius",
  "Supreme",
  "Crimson",
  "Shadow",
  "Celestial",
  "Demonic",
  "Sovereign",
  "Legendary",
  "Fallen",
  "Ascending",
  "Abyssal",
  "Iron",
  "Radiant",
];

const TITLE_NOUNS = [
  "Necromancer",
  "Swordmaster",
  "Player",
  "Hunter",
  "Emperor",
  "Alchemist",
  "Knight",
  "Sage",
  "Tower",
  "Dragon",
  "Saint",
  "Tyrant",
  "Disciple",
  "Monarch",
  "Berserker",
  "Archmage",
  "Gunslinger",
  "Reaper",
  "Warlord",
  "Phoenix",
];

const TITLE_SUFFIXES = [
  "of the Apocalypse",
  "Returns",
  "Reborn",
  "of the Dungeon",
  "Awakening",
  "of the Tenth Realm",
  "in Another World",
  "of the Frozen North",
  "Chronicles",
  "Ascension",
  "of the Broken Blade",
  "of Endless Night",
  "Rising",
  "Unleashed",
  "of the Last Tower",
];

const AUTHORS = [
  "Han Jae-rim",
  "Seo Yoon-ah",
  "Kang Min-ho",
  "Lee Da-eun",
  "Park Ji-hoon",
  "Nakamura Kaede",
  "Sato Ren",
  "Wei Chen",
  "Lin Mei",
  "Choi Eun-bi",
];

const ARTISTS = [
  "Studio Lumen",
  "Inkfall Works",
  "Aether Panel",
  "Noctis Studio",
  "Vermillion Art",
  "Halcyon Lines",
  "Onyx Frames",
  "Solaris Ink",
];

const STATUSES: ComicStatus[] = ["ONGOING", "COMPLETED", "HIATUS"];
const TYPES: ComicType[] = ["MANHWA", "MANGA", "MANHUA"];

function buildSynopsis(title: string, rng: () => number): string {
  const hooks = [
    `After a betrayal that cost everything, the protagonist of ${title} claws back from the brink of death with memories of a future that never came to pass.`,
    `When the gates between worlds shattered, only one person retained the power to grow stronger without limit. This is the story of ${title}.`,
    `Cast down from the heavens and stripped of rank, a once-great power must rebuild from nothing in ${title}.`,
    `An ordinary office worker awakens a hidden system that rewrites the rules of survival in ${title}.`,
  ];
  const middles = [
    "Armed with knowledge of what is to come, they set out to change a doomed destiny.",
    "Allies become enemies, and enemies become weapons, as the line between salvation and ruin blurs.",
    "Every level cleared brings new strength — and new monsters hungry for the throne.",
    "But power always has a price, and the world will not forgive those who climb too fast.",
  ];
  return `${hooks[Math.floor(rng() * hooks.length)]} ${
    middles[Math.floor(rng() * middles.length)]
  } Follow an epic journey of growth, vengeance, and the will to defy fate against impossible odds.`;
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function picsum(seed: string, w: number, h: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

export interface MockComic extends Comic {}

function generateComic(i: number): MockComic {
  const rng = seededRandom(1000 + i * 7919);
  const adj = TITLE_ADJECTIVES[i % TITLE_ADJECTIVES.length];
  const noun = TITLE_NOUNS[(i * 3) % TITLE_NOUNS.length];
  const useSuffix = rng() > 0.4;
  const title = useSuffix
    ? `The ${adj} ${noun} ${pick(TITLE_SUFFIXES, rng)}`
    : `The ${adj} ${noun}`;
  const slug = `${slugify(title)}-${i}`;

  const status = pick(STATUSES, rng);
  const type = pick(TYPES, rng);
  const releaseYear = 2016 + Math.floor(rng() * 9);

  // 5 - 200 chapters
  const chapterCount = 5 + Math.floor(rng() * 196);
  const now = Date.now();
  const updateGapHours = 6 + rng() * 240;

  const chapters: Chapter[] = [];
  for (let c = 0; c < chapterCount; c++) {
    const number = c + 1;
    const publishedAt = new Date(
      now - (chapterCount - c) * updateGapHours * 3600 * 1000
    ).toISOString();
    chapters.push({
      id: `${slug}_ch_${number}`,
      comicId: slug,
      number,
      title: rng() > 0.6 ? `${pick(TITLE_SUFFIXES, rng)}` : null,
      views: Math.floor(500 + rng() * 80000),
      publishedAt,
    });
  }
  chapters.reverse(); // newest first

  // genres: 2 - 5 unique
  const genreCount = 2 + Math.floor(rng() * 4);
  const chosen = new Set<number>();
  while (chosen.size < genreCount) chosen.add(Math.floor(rng() * GENRES.length));
  const genres = [...chosen].map((idx) => GENRES[idx]);

  const ratingCount = Math.floor(50 + rng() * 12000);
  const avgRating = Math.round((6.5 + rng() * 3.5) * 10) / 10;
  const totalViews = Math.floor(10000 + rng() * 5_000_000);

  const latest = chapters[0]?.publishedAt ?? new Date(now).toISOString();
  const createdAt = new Date(
    now - chapterCount * updateGapHours * 3600 * 1000
  ).toISOString();

  return {
    id: slug,
    slug,
    title,
    altTitles: [
      `${noun} ${adj}`,
      `${adj} ${noun} (Official)`,
    ],
    coverImage: picsum(`cover-${slug}`, 600, 800),
    bannerImage: picsum(`banner-${slug}`, 1600, 900),
    synopsis: buildSynopsis(title, rng),
    status,
    type,
    author: pick(AUTHORS, rng),
    artist: pick(ARTISTS, rng),
    releaseYear,
    totalViews,
    avgRating,
    ratingCount,
    featured: i < 6,
    isNew: i % 9 === 0,
    isHot: totalViews > 3_000_000,
    createdAt,
    updatedAt: latest,
    genres,
    chapters,
  };
}

let cached: MockComic[] | null = null;

export function getMockComics(): MockComic[] {
  if (cached) return cached;
  cached = Array.from({ length: 50 }, (_, i) => generateComic(i));
  return cached;
}

/** Stable list of page image URLs for a given comic + chapter. */
export function getMockChapterPages(slug: string, chapterNumber: number): string[] {
  const rng = seededRandom(
    Array.from(`${slug}-${chapterNumber}`).reduce((a, c) => a + c.charCodeAt(0), 0)
  );
  const pageCount = 8 + Math.floor(rng() * 18);
  return Array.from({ length: pageCount }, (_, p) =>
    picsum(`page-${slug}-${chapterNumber}-${p}`, 800, 1200)
  );
}
