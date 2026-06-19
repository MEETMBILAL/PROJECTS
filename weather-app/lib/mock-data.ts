import { slugify } from "./utils";

export type ComicStatus = "ONGOING" | "COMPLETED" | "HIATUS";
export type ComicType = "MANGA" | "MANHWA" | "MANHUA";

export type ChapterPage = {
  id: string;
  pageNumber: number;
  imageUrl: string;
  width: number;
  height: number;
};

export type Chapter = {
  id: string;
  comicId: string;
  number: number;
  title: string;
  views: number;
  publishedAt: string;
  pages: ChapterPage[];
};

export type Comic = {
  id: string;
  slug: string;
  title: string;
  altTitles: string[];
  coverImage: string;
  bannerImage: string;
  synopsis: string;
  status: ComicStatus;
  type: ComicType;
  author: string;
  artist: string;
  releaseYear: number;
  totalViews: number;
  avgRating: number;
  ratingCount: number;
  genres: string[];
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
  rankChange: number;
};

const genrePool = [
  "Action",
  "Fantasy",
  "Romance",
  "Manhwa",
  "System",
  "Regression",
  "Isekai",
  "Martial Arts",
  "Adventure",
  "Drama",
  "Comedy",
  "Supernatural",
  "Revenge",
  "Dungeon",
  "Magic",
  "School Life",
  "Shounen",
  "Seinen",
];

const titles = [
  "Return of the Iron Monarch",
  "The Regressed SSS-Class Hunter",
  "Duke Pendragon's Last Stand",
  "I Became the Tyrant's Tutor",
  "Solo Max-Level Newbie",
  "Chronicles of the Heavenly Demon",
  "The Nebula's Civil Engineer",
  "Academy's Genius Swordmaster",
  "Ranker Who Lives Twice",
  "The Lazy Lord Masters Magic",
  "My Daughter Is the Final Boss",
  "Overgeared Blacksmith",
  "Legend of the Northern Blade",
  "The Player Hides His Past",
  "Infinite Mage",
  "Pick Me Up, Infinite Gacha",
  "The World After the Fall",
  "Dungeon Reset Protocol",
  "The Novel's Extra Remake",
  "Reaper of the Drifting Moon",
  "Damn Reincarnation",
  "The Greatest Estate Developer",
  "Heavenly Inquisition Sword",
  "I Obtained a Mythic Item",
  "The Extra's Academy Survival",
  "Omniscient Reader's Archive",
  "The Dark Mage Returns",
  "Swordmaster's Youngest Son",
  "Necromancer's Evolution Trait",
  "The Archmage Transcends Time",
  "Villain to Kill",
  "Murim Login",
  "Boundless Necromancer",
  "Transcension Academy",
  "A Returner's Magic Manual",
  "Terminally-Ill Genius Knight",
  "The Knight King Who Returned",
  "Barbarian Questline",
  "The Tutorial Is Too Hard",
  "Reincarnated Assassin Is a Genius",
  "Star-Embracing Swordmaster",
  "The Priest of Corruption",
  "Absolute Sword Sense",
  "The Worn and Torn Newbie",
  "Surviving the Game as a Barbarian",
  "The Extra Is Too Strong",
  "Helmut: Forsaken Child",
  "The S-Classes That I Raised",
  "Dr. Player",
  "The Demon Prince Goes to Academy",
];

const authors = [
  "Lee Hyun",
  "Park Jae",
  "Kim Ryu",
  "Choi Raven",
  "Han Sol",
  "Yoon Arc",
  "Kang Mira",
  "Seo Jin",
  "Baek Orion",
  "Lim Ash",
];

const coverIds = [
  "photo-1612036782180-6f0b6cd846fe",
  "photo-1578632767115-351597cf2477",
  "photo-1607604276583-eef5d076aa5f",
  "photo-1618336753974-aae8e04506aa",
  "photo-1613376023733-0a73315d9b06",
  "photo-1528360983277-13d401cdc186",
  "photo-1601850494422-3cf14624b0b3",
  "photo-1541562232579-512a21360020",
  "photo-1599557303009-42f04b3aa8e1",
  "photo-1620428268482-cf1851a36764",
];

function pickGenres(index: number) {
  const count = 4 + (index % 3);
  return Array.from({ length: count }, (_, offset) => genrePool[(index * 3 + offset * 2) % genrePool.length]);
}

function makePages(comicIndex: number, chapterNumber: number): ChapterPage[] {
  return Array.from({ length: 8 + ((comicIndex + chapterNumber) % 6) }, (_, index) => {
    const seed = `${comicIndex + 11}-${chapterNumber}-${index + 1}`;
    return {
      id: `page-${comicIndex + 1}-${chapterNumber}-${index + 1}`,
      pageNumber: index + 1,
      imageUrl: `https://picsum.photos/seed/asura-${seed}/900/1350`,
      width: 900,
      height: 1350,
    };
  });
}

function makeChapters(comicIndex: number, comicId: string) {
  const chapterCount = 5 + ((comicIndex * 17) % 196);
  return Array.from({ length: chapterCount }, (_, index) => {
    const chapterNumber = chapterCount - index;
    const publishedAt = new Date(Date.now() - (index + comicIndex) * 7 * 60 * 60 * 1000).toISOString();
    return {
      id: `${comicId}-chapter-${chapterNumber}`,
      comicId,
      number: chapterNumber,
      title: chapterNumber % 5 === 0 ? "A Door Opens in the Dark" : `Chapter ${chapterNumber}`,
      views: 7_500 + comicIndex * 2_300 + chapterNumber * 141,
      publishedAt,
      pages: makePages(comicIndex, chapterNumber),
    };
  });
}

export const comics: Comic[] = titles.map((title, index) => {
  const slug = slugify(title);
  const comicId = `comic-${index + 1}`;
  const status: ComicStatus = index % 9 === 0 ? "HIATUS" : index % 4 === 0 ? "COMPLETED" : "ONGOING";
  const type: ComicType = index % 5 === 0 ? "MANGA" : index % 3 === 0 ? "MANHUA" : "MANHWA";
  const chapters = makeChapters(index, comicId);
  const updatedAt = chapters[0]?.publishedAt ?? new Date().toISOString();
  return {
    id: comicId,
    slug,
    title,
    altTitles: [`${title}: Awakening`, `${title} Chronicles`],
    coverImage: `https://images.unsplash.com/${coverIds[index % coverIds.length]}?auto=format&fit=crop&w=600&q=85`,
    bannerImage: `https://images.unsplash.com/${coverIds[(index + 4) % coverIds.length]}?auto=format&fit=crop&w=1600&q=85`,
    synopsis:
      "A powerless reader is pulled into a world of gates, noble houses, and impossible quests. With a forgotten skill and memories no one else possesses, they must climb through betrayal, monsters, and ancient systems to rewrite a doomed ending.",
    status,
    type,
    author: authors[index % authors.length],
    artist: authors[(index + 3) % authors.length],
    releaseYear: 2016 + (index % 9),
    totalViews: 130_000 + index * 77_531,
    avgRating: Number((8.1 + (index % 17) / 10).toFixed(1)),
    ratingCount: 450 + index * 91,
    genres: pickGenres(index),
    chapters,
    createdAt: new Date(Date.now() - (120 + index) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt,
    rankChange: (index % 5) - 2,
  };
});

export const allGenres = genrePool;

export function getFeaturedComics() {
  return comics.slice(0, 6);
}

export function getTrendingComics(limit = 10) {
  return [...comics].sort((a, b) => b.totalViews - a.totalViews).slice(0, limit);
}

export function getLatestComics(limit = 18) {
  return [...comics].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, limit);
}

export function getNewTitles(limit = 12) {
  return [...comics].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, limit);
}

export function getCompletedComics(limit = 12) {
  return comics.filter((comic) => comic.status === "COMPLETED").slice(0, limit);
}

export function getComicBySlug(slug: string) {
  return comics.find((comic) => comic.slug === slug);
}

export function getChapter(comicSlug: string, number: string | number) {
  const comic = getComicBySlug(comicSlug);
  if (!comic) return null;
  const numeric = Number(number);
  const chapter = comic.chapters.find((item) => item.number === numeric);
  return chapter ? { comic, chapter } : null;
}

export function getRelatedComics(comic: Comic) {
  return comics
    .filter((candidate) => candidate.id !== comic.id && candidate.genres.some((genre) => comic.genres.includes(genre)))
    .slice(0, 10);
}

export type ComicQuery = {
  genres?: string[];
  status?: ComicStatus | "ALL";
  type?: ComicType | "ALL";
  sort?: "latest" | "az" | "rating" | "views";
  q?: string;
  page?: number;
  pageSize?: number;
};

export function queryComics(query: ComicQuery = {}) {
  const page = Math.max(query.page ?? 1, 1);
  const pageSize = Math.min(Math.max(query.pageSize ?? 24, 1), 60);
  let result = [...comics];

  if (query.q) {
    const q = query.q.toLowerCase();
    result = result.filter((comic) => {
      return (
        comic.title.toLowerCase().includes(q) ||
        comic.altTitles.some((title) => title.toLowerCase().includes(q)) ||
        comic.genres.some((genre) => genre.toLowerCase().includes(q))
      );
    });
  }

  if (query.genres?.length) {
    result = result.filter((comic) => query.genres!.every((genre) => comic.genres.includes(genre)));
  }

  if (query.status && query.status !== "ALL") {
    result = result.filter((comic) => comic.status === query.status);
  }

  if (query.type && query.type !== "ALL") {
    result = result.filter((comic) => comic.type === query.type);
  }

  result.sort((a, b) => {
    if (query.sort === "az") return a.title.localeCompare(b.title);
    if (query.sort === "rating") return b.avgRating - a.avgRating;
    if (query.sort === "views") return b.totalViews - a.totalViews;
    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  });

  const start = (page - 1) * pageSize;
  return {
    items: result.slice(start, start + pageSize),
    total: result.length,
    page,
    pageSize,
    hasMore: start + pageSize < result.length,
  };
}
