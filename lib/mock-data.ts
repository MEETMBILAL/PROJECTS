import type { ChapterDTO, ComicDTO, ComicStatus, ComicType } from '@/lib/types';
import { slugify } from '@/lib/utils';

export const GENRES = [
  'Action',
  'Adventure',
  'Fantasy',
  'Romance',
  'Manhwa',
  'System',
  'Regression',
  'Isekai',
  'Martial Arts',
  'Genius MC',
  'Comedy',
  'Drama',
  'Dungeon',
  'Supernatural',
  'Murim',
  'Magic',
  'Revenge',
  'School Life',
];

const TITLES = [
  'The Sword Emperor’s Rise of Namgung',
  'Got Dropped into a Ghost Story, Still Gotta Work',
  "Sword God's Livestream",
  'The Divine Demon’s Grand Ascension',
  'Reformation of the Deadbeat Noble',
  'The Seventh Prince Wants to Bail',
  "The Regressed Mercenary's Machinations",
  'Barbarian Quest',
  'Pick Me Up, Infinite Gacha',
  'Surviving as a Genius on Borrowed Time',
  'Nano Machine',
  'Star-Embracing Swordmaster',
  'Return of the Mount Hua Sect',
  'The Return of the Crazy Demon',
  'Solo Max-Level Newbie',
  "Academy's Genius Swordmaster",
  'Absolute Sword Sense',
  'Revenge of the Iron-Blooded Sword Hound',
  'The Novel’s Extra',
  'The Extra’s Academy Survival Guide',
  'Overgeared',
  'Infinite Mage',
  'Absolute Regression',
  'Chronicles of the Demon Faction',
  "The Heavenly Demon Can't Live a Normal Life",
  'Raising Villains the Right Way',
  'Return of the Disaster-Class Hero',
  'The Knight King Who Returned with a God',
  'Logging 10,000 Years into the Future',
  'Solo Farming In The Tower',
  'The Cold-Blooded Warrior',
  'Bad Born Blood',
  'Rebirth of the Divine Demon',
  'The Demon King Overrun by Heroes',
  'Only I Have an EX-Grade Summon',
  'Kidnapped Dragons',
  'Crimson Reset',
  'Echoes of the Reverse Planet',
  'The Demon God',
  'Terminally-Ill Genius Dark Knight',
  'What a Bountiful Harvest, Demon Lord!',
  'I Killed an Academy Player',
  'The Executioner',
  'Doom Breaker: Ashen Crown',
  'Legend of the Frozen Star',
  'Ranker Who Sleeps Below Zero',
  'The Archmage Returns After 4000 Years',
  'Necromancer Academy and the Genius Summoner',
  'Leveling With the Gods',
  'The Stellar Sword Saint',
];

const statuses: ComicStatus[] = ['ONGOING', 'COMPLETED', 'HIATUS'];
const types: ComicType[] = ['MANHWA', 'MANGA', 'MANHUA'];

function pickGenres(index: number) {
  return [GENRES[index % GENRES.length], GENRES[(index + 2) % GENRES.length], GENRES[(index + 5) % GENRES.length]];
}

function makeChapters(slug: string, index: number): ChapterDTO[] {
  const count = 18 + ((index * 7) % 130);
  return Array.from({ length: count }, (_, chapterIndex) => {
    const number = chapterIndex + 1;
    const publishedAt = new Date(Date.now() - (count - chapterIndex) * 1000 * 60 * 60 * (8 + (index % 5)));
    return {
      id: `${slug}-chapter-${number}`,
      number,
      title: chapterIndex % 9 === 0 ? `Chapter ${number} - The Turning Point` : `Chapter ${number}`,
      views: 1200 + index * 930 + chapterIndex * 381,
      publishedAt: publishedAt.toISOString(),
      pages: Array.from({ length: 7 }, (_, pageIndex) => ({
        id: `${slug}-chapter-${number}-page-${pageIndex + 1}`,
        pageNumber: pageIndex + 1,
        imageUrl: `https://picsum.photos/seed/${slug}-${number}-${pageIndex + 1}/900/1400`,
        width: 900,
        height: 1400,
      })),
    };
  }).reverse();
}

export const MOCK_COMICS: ComicDTO[] = TITLES.map((title, index) => {
  const slug = slugify(title);
  const chapters = makeChapters(slug, index);
  const avgRating = Number((7.2 + ((index * 37) % 28) / 10).toFixed(1));
  const status = index % 11 === 0 ? 'COMPLETED' : statuses[index % statuses.length];
  return {
    id: `comic-${index + 1}`,
    slug,
    title,
    altTitles: [`${title} Novel`, `${title} Webtoon`],
    coverImage: `https://picsum.photos/seed/asura-cover-${index + 1}/600/800`,
    bannerImage: `https://picsum.photos/seed/asura-banner-${index + 1}/1600/900`,
    synopsis:
      'In a world ruled by towers, ancient sects, and impossible systems, one outcast discovers a second chance that could rewrite every fate. Stylish battles, ruthless rivals, and character-driven progression unfold chapter by chapter.',
    status,
    type: types[index % types.length],
    author: ['Hwang Geum', 'Blue Studio', 'Lee Dowon', 'Park Jinhwan'][index % 4],
    artist: ['Redice Studio', 'Inkline', 'Studio N', 'Moonlight Works'][index % 4],
    releaseYear: 2016 + (index % 10),
    totalViews: 150000 + index * 91721,
    avgRating,
    ratingCount: 450 + index * 83,
    genres: pickGenres(index),
    chapters,
    createdAt: new Date(Date.now() - (index + 30) * 86400000).toISOString(),
    updatedAt: chapters[0]?.publishedAt ?? new Date().toISOString(),
  };
});

export function getMockComic(slug: string) {
  return MOCK_COMICS.find((comic) => comic.slug === slug) ?? null;
}
