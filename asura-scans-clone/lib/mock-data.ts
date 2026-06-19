import { subDays, subHours } from "date-fns";
import type { Chapter, ChapterPage, Comic, ComicStatus, ComicType, Genre } from "@/types/comic";

const now = new Date();

export const genres: Genre[] = [
  "Action",
  "Fantasy",
  "Romance",
  "Manhwa",
  "System",
  "Regression",
  "Isekai",
  "Martial Arts",
  "Dungeon",
  "Adventure",
  "Drama",
  "Revenge",
  "Comedy",
  "Supernatural"
].map((name) => ({
  id: name.toLowerCase().replace(/\s+/g, "-"),
  name,
  slug: name.toLowerCase().replace(/\s+/g, "-")
}));

const cover = (id: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&q=80`;

const banners = [
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=80"
];

const coverIds = [
  1518709268805,
  1500530855697,
  1493246507139,
  1519681393784,
  1520975682031,
  1495567720989,
  1500534314209,
  1477346611705,
  1506744038136,
  1497436072909,
  1518544883836,
  1501785888041
];

function chapterSet(count: number, offset = 0): Chapter[] {
  return Array.from({ length: count }, (_, index) => {
    const number = count - index;
    return {
      id: `chapter-${offset}-${number}`,
      number,
      title: number % 10 === 0 ? "The Monarch Returns" : `Chapter ${number}`,
      views: 10000 + number * 643,
      publishedAt: subHours(now, index * 8 + offset).toISOString()
    };
  });
}

function pickGenres(...slugs: string[]) {
  return genres.filter((genre) => slugs.includes(genre.slug));
}

type ComicSeed = Omit<Comic, "id" | "coverImage" | "bannerImage" | "chapters" | "genres" | "createdAt" | "updatedAt"> & {
  chapters: number;
  coverIndex: number;
  bannerIndex: number;
  genreSlugs: string[];
};

const seeds: ComicSeed[] = [
  {
    slug: "solo-max-level-newbie",
    title: "Solo Max-Level Newbie",
    altTitles: ["The Max-Level Player Starts Again"],
    synopsis:
      "Kang Jinhyuk cleared the tower as a streamer when everyone else quit. When the tower becomes reality, his forgotten knowledge turns into humanity's best weapon.",
    status: "ONGOING",
    type: "MANHWA",
    author: "Maslow",
    artist: "Swing Bat",
    releaseYear: 2021,
    totalViews: 9823412,
    avgRating: 9.7,
    ratingCount: 18842,
    chapters: 189,
    coverIndex: 0,
    bannerIndex: 0,
    genreSlugs: ["action", "fantasy", "system", "dungeon"]
  },
  {
    slug: "return-of-the-broken-constellation",
    title: "Return of the Broken Constellation",
    altTitles: ["The Divine Twilight Returns"],
    synopsis:
      "A fallen god wakes in the body of a doomed hunter and begins reclaiming his myths through brutal trials, ancient relics, and unfinished revenge.",
    status: "ONGOING",
    type: "MANHWA",
    author: "Sadoyeon",
    artist: "Fleximind",
    releaseYear: 2022,
    totalViews: 7443210,
    avgRating: 9.5,
    ratingCount: 14311,
    chapters: 142,
    coverIndex: 1,
    bannerIndex: 1,
    genreSlugs: ["action", "fantasy", "regression", "revenge"]
  },
  {
    slug: "heavenly-demon-cant-live-normal-life",
    title: "Heavenly Demon Can't Live a Normal Life",
    altTitles: ["The Heavenly Demon Lives Differently"],
    synopsis:
      "A legendary cult leader is reborn as a disgraced noble. He tries to live quietly, but a corrupt kingdom keeps mistaking restraint for weakness.",
    status: "ONGOING",
    type: "MANHWA",
    author: "Zaino",
    artist: "San Cheon",
    releaseYear: 2021,
    totalViews: 6960421,
    avgRating: 9.4,
    ratingCount: 11993,
    chapters: 131,
    coverIndex: 2,
    bannerIndex: 2,
    genreSlugs: ["action", "martial-arts", "fantasy", "drama"]
  },
  {
    slug: "sss-class-revival-hunter",
    title: "SSS-Class Revival Hunter",
    altTitles: ["SSS-Class Suicide Hunter"],
    synopsis:
      "A weak hunter gains the power to copy skills after dying. In a world where death rewinds time, obsession becomes his sharpest blade.",
    status: "ONGOING",
    type: "MANHWA",
    author: "Shin Noah",
    artist: "Bill K",
    releaseYear: 2020,
    totalViews: 8561442,
    avgRating: 9.8,
    ratingCount: 22930,
    chapters: 118,
    coverIndex: 3,
    bannerIndex: 3,
    genreSlugs: ["action", "fantasy", "system", "drama"]
  },
  {
    slug: "duke-pendragon",
    title: "Duke Pendragon",
    altTitles: ["White Dragon Duke"],
    synopsis:
      "A condemned soldier receives one last chance as the heir of a fallen duchy bound to a dragon. Noble politics and battlefield strategy collide.",
    status: "COMPLETED",
    type: "MANHWA",
    author: "Kim Hyungjun",
    artist: "Redice Studio",
    releaseYear: 2022,
    totalViews: 4320811,
    avgRating: 8.9,
    ratingCount: 8361,
    chapters: 96,
    coverIndex: 4,
    bannerIndex: 0,
    genreSlugs: ["fantasy", "action", "adventure", "drama"]
  },
  {
    slug: "academy-genius-swordsman",
    title: "Academy's Genius Swordsman",
    altTitles: ["The Genius Swordsman of the Academy"],
    synopsis:
      "After failing to stop the end of the world, Ronan wakes as his younger self and cuts a cleaner path through a prestigious magical academy.",
    status: "ONGOING",
    type: "MANHWA",
    author: "Seo Gwan",
    artist: "Sika",
    releaseYear: 2023,
    totalViews: 5234201,
    avgRating: 9.2,
    ratingCount: 10034,
    chapters: 73,
    coverIndex: 5,
    bannerIndex: 1,
    genreSlugs: ["action", "fantasy", "regression", "comedy"]
  },
  {
    slug: "the-extra-academy-survival-guide",
    title: "The Extra's Academy Survival Guide",
    altTitles: ["How to Survive as an Extra"],
    synopsis:
      "Dropped into a game as an expendable side character, Ed must exploit every hidden route to survive classes, monsters, and main-character chaos.",
    status: "ONGOING",
    type: "MANHWA",
    author: "Corita",
    artist: "Green Tea",
    releaseYear: 2024,
    totalViews: 4732210,
    avgRating: 9.3,
    ratingCount: 9344,
    chapters: 58,
    coverIndex: 6,
    bannerIndex: 2,
    genreSlugs: ["isekai", "fantasy", "romance", "comedy"]
  },
  {
    slug: "legendary-moonlight-sculptor",
    title: "Legendary Moonlight Sculptor",
    altTitles: ["Moonlight Sculptor"],
    synopsis:
      "A debt-ridden gamer enters a vast VR world as a sculptor and turns patience, bargains, and craftsmanship into legendary power.",
    status: "HIATUS",
    type: "MANHWA",
    author: "Nam Heesung",
    artist: "Kim Tae-hyung",
    releaseYear: 2015,
    totalViews: 6122311,
    avgRating: 8.8,
    ratingCount: 12001,
    chapters: 169,
    coverIndex: 7,
    bannerIndex: 3,
    genreSlugs: ["adventure", "fantasy", "comedy", "system"]
  },
  {
    slug: "villainess-turns-the-hourglass",
    title: "The Villainess Turns the Hourglass",
    altTitles: ["Hourglass of the Villainess"],
    synopsis:
      "Executed after a life of schemes, Aria rewinds time and learns to weaponize etiquette, wealth, and patience against the nobles who used her.",
    status: "COMPLETED",
    type: "MANHWA",
    author: "SanSoby",
    artist: "Antstudio",
    releaseYear: 2020,
    totalViews: 5011220,
    avgRating: 9.1,
    ratingCount: 11231,
    chapters: 125,
    coverIndex: 8,
    bannerIndex: 0,
    genreSlugs: ["romance", "drama", "regression", "revenge"]
  },
  {
    slug: "nano-machine",
    title: "Nano Machine",
    altTitles: ["Nanomasin"],
    synopsis:
      "A discarded prince of the demonic cult receives a machine from the future and begins dismantling a brutal hierarchy from the inside.",
    status: "ONGOING",
    type: "MANHWA",
    author: "Hanjung Wolya",
    artist: "Geumgang Bulgoe",
    releaseYear: 2020,
    totalViews: 10023411,
    avgRating: 9.6,
    ratingCount: 21012,
    chapters: 215,
    coverIndex: 9,
    bannerIndex: 1,
    genreSlugs: ["action", "martial-arts", "system", "revenge"]
  },
  {
    slug: "omniscient-readers-viewpoint",
    title: "Omniscient Reader's Viewpoint",
    altTitles: ["ORV"],
    synopsis:
      "Dokja is the only reader of a failed webnovel. When its apocalypse becomes reality, his lonely obsession becomes the map to survival.",
    status: "ONGOING",
    type: "MANHWA",
    author: "Sing Shong",
    artist: "Sleepy-C",
    releaseYear: 2020,
    totalViews: 11234110,
    avgRating: 9.9,
    ratingCount: 30901,
    chapters: 221,
    coverIndex: 10,
    bannerIndex: 2,
    genreSlugs: ["action", "fantasy", "system", "supernatural"]
  },
  {
    slug: "mount-hua-sect",
    title: "Return of the Mount Hua Sect",
    altTitles: ["Volcanic Return"],
    synopsis:
      "The greatest swordsman of Mount Hua wakes a century later to find his sect ruined. Rebuilding it will require fists, discipline, and shameless fundraising.",
    status: "ONGOING",
    type: "MANHWA",
    author: "Biga",
    artist: "LICO",
    releaseYear: 2021,
    totalViews: 9722013,
    avgRating: 9.8,
    ratingCount: 25412,
    chapters: 156,
    coverIndex: 11,
    bannerIndex: 3,
    genreSlugs: ["action", "martial-arts", "comedy", "adventure"]
  }
];

export const comics: Comic[] = seeds.map((seed, index) => ({
  id: `comic-${index + 1}`,
  slug: seed.slug,
  title: seed.title,
  altTitles: seed.altTitles,
  coverImage: cover(coverIds[index]),
  bannerImage: banners[seed.bannerIndex],
  synopsis: seed.synopsis,
  status: seed.status as ComicStatus,
  type: seed.type as ComicType,
  author: seed.author,
  artist: seed.artist,
  releaseYear: seed.releaseYear,
  totalViews: seed.totalViews,
  avgRating: seed.avgRating,
  ratingCount: seed.ratingCount,
  genres: pickGenres(...seed.genreSlugs),
  chapters: chapterSet(seed.chapters, index),
  createdAt: subDays(now, 220 - index * 7).toISOString(),
  updatedAt: subHours(now, index * 3 + 1).toISOString()
}));

export function getComicBySlug(slug: string) {
  return comics.find((comic) => comic.slug === slug);
}

export function getChapter(slug: string, num: number) {
  return getComicBySlug(slug)?.chapters.find((chapter) => chapter.number === num);
}

export function getPagesForChapter(chapterId: string): ChapterPage[] {
  const chapterSeed = chapterId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return Array.from({ length: 8 }, (_, index) => ({
    id: `${chapterId}-page-${index + 1}`,
    pageIndex: index + 1,
    imageUrl: `https://placehold.co/800x1200/111111/FFFFFF/png?text=Chapter+Page+${index + 1}+%E2%80%A2+${chapterSeed}`,
    width: 800,
    height: 1200
  }));
}
