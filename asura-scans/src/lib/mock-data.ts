import type {
  ChapterDTO,
  ComicCardDTO,
  ComicDetailDTO,
  ComicStatus,
  ComicType,
  GenreDTO,
} from "./types";
import { slugify } from "./utils";

/**
 * Deterministic, dependency-free mock dataset.
 *
 * This mirrors the Prisma seed (`prisma/seed.ts`) so the application renders a
 * realistic, fully populated UI even when no PostgreSQL database is configured.
 * Image URLs point at picsum.photos with stable seeds so covers are consistent.
 */

export const GENRES: GenreDTO[] = [
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
].map((name) => ({ id: `genre_${slugify(name)}`, name, slug: slugify(name) }));

const TITLES: string[] = [
  "Solo Leveling: Ragnarok",
  "The Beginning After The End",
  "Omniscient Reader's Viewpoint",
  "Nano Machine",
  "Return of the Mount Hua Sect",
  "Reaper of the Drifting Moon",
  "The Greatest Estate Developer",
  "Damn Reincarnation",
  "Legend of the Northern Blade",
  "Eleceed",
  "Tower of God: Origin",
  "Overgeared Reborn",
  "The Constellation That Returned From Hell",
  "Pick Me Up, Infinite Gacha",
  "Sss-Class Suicide Hunter",
  "Academy's Genius Swordsman",
  "The Heavenly Demon Can't Live a Normal Life",
  "Regressor's Tale of Cultivation",
  "I Became the Tyrant of a Defense Game",
  "The Max Level Hero Has Returned",
  "Past Lives of the Thunder God",
  "Swordmaster's Youngest Son",
  "Reformation of the Deadbeat Noble",
  "Infinite Mage",
  "The Live: After Apocalypse",
  "Murim Login",
  "Worn and Torn Newbie",
  "Star-Embracing Swordmaster",
  "The Knight King Who Returned With a God",
  "Dragon-Devouring Mage",
  "Memoir of the King of War",
  "Revenge of the Iron-Blooded Sword Hound",
  "The Extra's Academy Survival Guide",
  "Leveling With the Gods",
  "Volcanic Age",
  "Hero Killer",
  "Return of the Frozen Player",
  "The Tutorial Is Too Hard",
  "Genius of the Unique Lineage",
  "Reincarnator",
  "Boundless Necromancer",
  "Everyone Else Is a Returnee",
  "The S-Classes That I Raised",
  "Quest Supremacy",
  "Auto-Hunting With Clones",
  "The Game's Greatest Troll",
  "Helmut: The Forsaken Child",
  "Carnivorous Hunter",
  "Shadow Slave: Awakening",
  "The Last Adventurer",
];

const AUTHORS = [
  "Chugong",
  "TurtleMe",
  "Sing Shong",
  "Han Joong Wol Ya",
  "LICO",
  "Biwan",
  "Moon-Geuk-Ji",
  "Ryu Hyang",
  "Wee Bok",
  "Son Je-ho",
];

const ARTISTS = [
  "DUBU",
  "Fuyuki23",
  "Sleepy-C",
  "Redice Studio",
  "Studio JHU",
  "Kim Se-hun",
  "Jang Sung-rak",
  "P2C Studio",
  "Gemiyong",
  "Sumchun",
];

const SYNOPSES = [
  "Ten years ago, after the Gate that connected the real world with the monster world opened, some ordinary people received the power to hunt monsters. They are known as Hunters. However, not all Hunters are powerful — one of them, the weakest, is about to change everything.",
  "King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability. But solitude lingers closely behind those with great power. Reincarnated into a new world filled with magic and monsters, he gets a second chance to relive his life — and correct the mistakes of his past.",
  "Only I know the end of this world. One day, our protagonist finds that the web novel he had been reading for years — and the only one to have finished — has become reality. Now he must survive scenarios he alone knows the outcome of.",
  "Born with a frail body, a young man trains relentlessly in the murim, mastering forbidden techniques to protect the people he loves and carve his name into legend.",
  "After dying at the peak of his power, a legendary swordsman is reborn in the body of a struggling academy student. With memories of a thousand battles, he sets out to reclaim his glory.",
  "The strongest hunter humanity has ever known returns from the abyss, carrying secrets that could either save the world or doom it entirely.",
  "Reincarnated as the villain destined to die in the prologue, he refuses to accept his fate and rewrites the story using knowledge from his previous life.",
];

// Simple deterministic pseudo-random generator seeded by index.
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const STATUSES: ComicStatus[] = ["ONGOING", "COMPLETED", "HIATUS"];
const TYPES: ComicType[] = ["MANHWA", "MANGA", "MANHUA"];

function cover(slug: string): string {
  return `https://picsum.photos/seed/asura-${slug}/400/533`;
}
function banner(slug: string): string {
  return `https://picsum.photos/seed/asura-banner-${slug}/1600/720`;
}

const NOW = Date.UTC(2026, 5, 19, 10, 0, 0); // stable "now" for deterministic timestamps

function buildChapters(slug: string, count: number, rand: () => number): ChapterDTO[] {
  const chapters: ChapterDTO[] = [];
  for (let i = count; i >= 1; i--) {
    const ageHours = (count - i) * (6 + Math.floor(rand() * 60));
    chapters.push({
      id: `${slug}-ch-${i}`,
      number: i,
      title: rand() > 0.6 ? `The Awakening (Part ${i})` : null,
      views: Math.floor(2000 + rand() * 90000),
      publishedAt: new Date(NOW - ageHours * 3600 * 1000).toISOString(),
      pageCount: 12 + Math.floor(rand() * 24),
    });
  }
  return chapters; // newest first
}

function buildComic(title: string, index: number): ComicDetailDTO {
  const rand = rng(index + 1);
  const slug = slugify(title);
  const status = STATUSES[Math.floor(rand() * (index < 8 ? 1 : STATUSES.length))];
  const type = TYPES[Math.floor(rand() * TYPES.length)];
  const chapterCount = 5 + Math.floor(rand() * 196); // 5–200
  const allChapters = buildChapters(slug, chapterCount, rand);
  const avgRating = Math.round((6.5 + rand() * 3.4) * 10) / 10; // 6.5–9.9
  const ratingCount = Math.floor(120 + rand() * 18000);
  const totalViews = Math.floor(50_000 + rand() * 9_500_000);
  const weeklyViews = Math.floor(totalViews * (0.02 + rand() * 0.06));
  const monthlyViews = Math.floor(totalViews * (0.08 + rand() * 0.15));
  const createdDaysAgo = Math.floor(rand() * 800);
  const updatedHoursAgo = Math.floor(rand() * 240);

  // Assign 3–5 genres deterministically.
  const genreCount = 3 + Math.floor(rand() * 3);
  const chosen = new Set<number>();
  while (chosen.size < genreCount) chosen.add(Math.floor(rand() * GENRES.length));
  const genres = [...chosen].map((i) => GENRES[i]);

  return {
    id: `comic_${index + 1}`,
    slug,
    title,
    altTitles: [
      `${title} (Official)`,
      title
        .split(" ")
        .map((w) => w[0])
        .join(""),
    ],
    coverImage: cover(slug),
    bannerImage: banner(slug),
    synopsis: SYNOPSES[index % SYNOPSES.length],
    status,
    type,
    author: AUTHORS[index % AUTHORS.length],
    artist: ARTISTS[index % ARTISTS.length],
    releaseYear: 2018 + (index % 8),
    totalViews,
    weeklyViews,
    monthlyViews,
    avgRating,
    ratingCount,
    isNew: createdDaysAgo < 30,
    isHot: weeklyViews > 250_000,
    createdAt: new Date(NOW - createdDaysAgo * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(NOW - updatedHoursAgo * 3600 * 1000).toISOString(),
    genres,
    chapterCount,
    latestChapters: allChapters.slice(0, 3),
  };
}

export const MOCK_COMICS: ComicDetailDTO[] = TITLES.map(buildComic);

// Full chapter lists are generated lazily and cached per slug.
const chapterCache = new Map<string, ChapterDTO[]>();

export function getMockChapters(slug: string): ChapterDTO[] {
  if (chapterCache.has(slug)) return chapterCache.get(slug)!;
  const index = MOCK_COMICS.findIndex((c) => c.slug === slug);
  if (index === -1) return [];
  const rand = rng(index + 1);
  // Re-run the same derivation to reach chapterCount, discarding earlier draws.
  void STATUSES[Math.floor(rand() * (index < 8 ? 1 : STATUSES.length))];
  void TYPES[Math.floor(rand() * TYPES.length)];
  const chapterCount = 5 + Math.floor(rand() * 196);
  const list = buildChapters(slug, chapterCount, rng(index + 1));
  chapterCache.set(slug, list);
  return list;
}

export function getMockPageImages(slug: string, chapterNumber: number) {
  const index = Math.max(0, MOCK_COMICS.findIndex((c) => c.slug === slug));
  const rand = rng(index * 1000 + chapterNumber);
  const pageCount = 10 + Math.floor(rand() * 18);
  return Array.from({ length: pageCount }, (_, i) => ({
    pageIndex: i,
    imageUrl: `https://picsum.photos/seed/asura-${slug}-${chapterNumber}-${i}/800/1200`,
    width: 800,
    height: 1200,
  }));
}

export function toCard(c: ComicDetailDTO): ComicCardDTO {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    coverImage: c.coverImage,
    status: c.status,
    type: c.type,
    avgRating: c.avgRating,
    ratingCount: c.ratingCount,
    totalViews: c.totalViews,
    isNew: c.isNew,
    isHot: c.isHot,
    updatedAt: c.updatedAt,
    latestChapters: c.latestChapters,
  };
}
