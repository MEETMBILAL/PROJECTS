import type { BrowseFilters, Chapter, Comic, ComicStatus, ComicType, Genre } from "@/lib/types";
import { normalizeSlug } from "@/lib/format";

const coverImages = [
  "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1588497859490-85d1c17db96d?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1559981421-3e0c0d712e3b?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1620336655052-b57986f5a26a?auto=format&fit=crop&w=800&q=85",
];

const bannerImages = [
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1520034475321-cbe63696469a?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=85",
];

const genreNames = [
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
  "Dungeon",
  "Revenge",
  "Magic",
  "School Life",
];

export const genres: Genre[] = genreNames.map((name, index) => ({
  id: `genre-${index + 1}`,
  name,
  slug: normalizeSlug(name),
}));

const titleSeeds = [
  "Solo Max-Level Newbie",
  "Return of the Broken Constellation",
  "The Nebula's Civilisation",
  "Damn Reincarnation",
  "Swordmaster's Youngest Son",
  "Reaper of the Drifting Moon",
  "The Heavenly Demon Can't Live Normally",
  "Academy's Genius Swordmaster",
  "Terminally-Ill Genius Dark Knight",
  "The Extra's Academy Survival Guide",
  "Legendary Ranker's Comeback",
  "Chronicles of the Mystic Scholar",
  "Dungeon Reset Protocol",
  "The Regressed Mercenary",
  "Tower of the Frozen King",
  "Infinite Mage",
  "Moonlit Warlock",
  "Villain to Kill",
  "Dragon-Devouring Mage",
  "Player Who Returned 10,000 Years Later",
  "Absolute Sword Sense",
  "The Novel's Extra Remake",
  "Priest of Corruption",
  "Worn and Torn Newbie",
  "Regressing with the King's Power",
];

function chapterList(comicIndex: number, count: number): Chapter[] {
  return Array.from({ length: count }).map((_, chapterIndex) => {
    const chapterNumber = count - chapterIndex;
    const date = new Date(Date.now() - (chapterIndex + comicIndex) * 1000 * 60 * 60 * 12);
    return {
      id: `chapter-${comicIndex + 1}-${chapterNumber}`,
      number: chapterNumber,
      title: chapterNumber % 7 === 0 ? "The Ominous Gate" : chapterNumber % 5 === 0 ? "A New Trial" : "",
      views: 2000 + comicIndex * 725 + chapterNumber * 311,
      publishedAt: date.toISOString(),
      pages: Array.from({ length: 8 }).map((__, pageIndex) => ({
        id: `page-${comicIndex + 1}-${chapterNumber}-${pageIndex + 1}`,
        pageNumber: pageIndex + 1,
        imageUrl: `https://placehold.co/900x1400/0f0f0f/ffffff?text=${encodeURIComponent(`Chapter ${chapterNumber} Page ${pageIndex + 1}`)}`,
        width: 900,
        height: 1400,
      })),
    };
  });
}

export const comics: Comic[] = Array.from({ length: 50 }).map((_, index) => {
  const baseTitle = titleSeeds[index % titleSeeds.length];
  const suffix = index >= titleSeeds.length ? ` ${Math.floor(index / titleSeeds.length) + 1}` : "";
  const title = `${baseTitle}${suffix}`;
  const status: ComicStatus = index % 9 === 0 ? "COMPLETED" : index % 13 === 0 ? "HIATUS" : "ONGOING";
  const type: ComicType = index % 3 === 0 ? "MANHWA" : index % 3 === 1 ? "MANGA" : "MANHUA";
  const count = Math.min(200, 5 + ((index * 17) % 196));
  const pickedGenres = [genres[index % genres.length], genres[(index + 3) % genres.length], genres[(index + 7) % genres.length]];
  const updated = new Date(Date.now() - index * 1000 * 60 * 60 * 4).toISOString();
  return {
    id: `comic-${index + 1}`,
    slug: normalizeSlug(title),
    title,
    altTitles: [`${title} Remastered`, `${title} KR`],
    coverImage: coverImages[index % coverImages.length],
    bannerImage: bannerImages[index % bannerImages.length],
    synopsis:
      "A relentless hero is pulled into a brutal world of gates, secret clans, and impossible quests. Every chapter raises the stakes with clean action, sharp rivalries, and the signature dark fantasy tone readers expect from a premium scanlation platform.",
    status,
    type,
    author: ["Chugong", "Kim Carnby", "JH", "Sing-Shong", "Ryu Geum-cheol"][index % 5],
    artist: ["Dubu", "Redice Studio", "Sleepy-C", "Mia", "Nangsun"][index % 5],
    releaseYear: 2016 + (index % 9),
    totalViews: 89000 + index * 18317,
    avgRating: Number((7.8 + (index % 17) / 10).toFixed(1)),
    ratingCount: 500 + index * 41,
    chapterCount: count,
    genres: pickedGenres,
    chapters: chapterList(index, count),
    createdAt: new Date(Date.now() - (90 + index) * 86400000).toISOString(),
    updatedAt: updated,
    isNew: index > 39,
    isHot: index < 10,
  };
});

export const featuredComics = comics.slice(0, 5);
export const trendingComics = [...comics].sort((a, b) => b.totalViews - a.totalViews).slice(0, 10);
export const latestComics = [...comics].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
export const newComics = comics.filter((comic) => comic.isNew).slice(0, 12);
export const completedComics = comics.filter((comic) => comic.status === "COMPLETED").slice(0, 12);

export function getComicBySlug(slug: string) {
  return comics.find((comic) => comic.slug === slug);
}

export function getRelatedComics(comic: Comic) {
  const genreSlugs = new Set(comic.genres.map((genre) => genre.slug));
  return comics
    .filter((candidate) => candidate.id !== comic.id && candidate.genres.some((genre) => genreSlugs.has(genre.slug)))
    .slice(0, 10);
}

export function getChapter(comicSlug: string, chapterNumber: string | number) {
  const comic = getComicBySlug(comicSlug);
  const number = Number(chapterNumber);
  return {
    comic,
    chapter: comic?.chapters.find((chapter) => chapter.number === number),
  };
}

export function browseComics(filters: BrowseFilters) {
  const genreSet = new Set(filters.genres?.filter(Boolean));
  let result = comics.filter((comic) => {
    const matchesGenre = genreSet.size === 0 || comic.genres.some((genre) => genreSet.has(genre.slug));
    const matchesStatus = !filters.status || filters.status === "ALL" || comic.status === filters.status;
    const matchesType = !filters.type || filters.type === "ALL" || comic.type === filters.type;
    return matchesGenre && matchesStatus && matchesType;
  });

  if (filters.sort === "az") result = result.sort((a, b) => a.title.localeCompare(b.title));
  if (filters.sort === "rating") result = result.sort((a, b) => b.avgRating - a.avgRating);
  if (filters.sort === "views") result = result.sort((a, b) => b.totalViews - a.totalViews);
  if (!filters.sort || filters.sort === "latest") result = result.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

  return result;
}

export function searchComics(query: string) {
  const value = query.trim().toLowerCase();
  if (!value) return [];
  return comics
    .filter((comic) => {
      return (
        comic.title.toLowerCase().includes(value) ||
        comic.altTitles.some((title) => title.toLowerCase().includes(value)) ||
        comic.genres.some((genre) => genre.name.toLowerCase().includes(value))
      );
    })
    .slice(0, 20);
}
