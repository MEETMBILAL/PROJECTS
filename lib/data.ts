import { prisma } from '@/lib/prisma';
import { MOCK_COMICS } from '@/lib/mock-data';
import type { ChapterDTO, ComicDTO, ComicQuery, PaginatedComics } from '@/lib/types';

const hasDatabase = Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('user:password'));

function applyMockQuery(query: ComicQuery): PaginatedComics {
  const page = Math.max(query.page ?? 1, 1);
  const pageSize = Math.min(Math.max(query.pageSize ?? 24, 1), 60);
  const search = query.q?.toLowerCase().trim();
  const genres = query.genres?.filter(Boolean) ?? [];

  let items = MOCK_COMICS.filter((comic) => {
    const matchesSearch = search
      ? [comic.title, comic.synopsis, comic.author, comic.artist, ...comic.genres].some((value) =>
          value.toLowerCase().includes(search),
        )
      : true;
    const matchesGenres = genres.length ? genres.every((genre) => comic.genres.includes(genre)) : true;
    return (
      matchesSearch &&
      matchesGenres &&
      (!query.status || comic.status === query.status) &&
      (!query.type || comic.type === query.type)
    );
  });

  items = [...items].sort((a, b) => {
    switch (query.sort) {
      case 'az':
        return a.title.localeCompare(b.title);
      case 'rating':
        return b.avgRating - a.avgRating;
      case 'views':
        return b.totalViews - a.totalViews;
      case 'latest':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  const total = items.length;
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    total,
    page,
    pageSize,
    totalPages,
  };
}

type PrismaComic = Awaited<ReturnType<typeof prisma.comic.findFirst>> & {
  genres?: { genre: { name: string } }[];
  chapters?: { id: string; number: number; title: string | null; views: number; publishedAt: Date }[];
};

function mapPrismaComic(comic: NonNullable<PrismaComic>): ComicDTO {
  const chapters = (comic.chapters ?? []).map((chapter) => ({
    id: chapter.id,
    number: chapter.number,
    title: chapter.title ?? `Chapter ${chapter.number}`,
    views: chapter.views,
    publishedAt: chapter.publishedAt.toISOString(),
    pages: [],
  }));

  return {
    id: comic.id,
    slug: comic.slug,
    title: comic.title,
    altTitles: comic.altTitles,
    coverImage: comic.coverImage,
    bannerImage: comic.bannerImage ?? comic.coverImage,
    synopsis: comic.synopsis,
    status: comic.status,
    type: comic.type,
    author: comic.author,
    artist: comic.artist,
    releaseYear: comic.releaseYear,
    totalViews: comic.totalViews,
    avgRating: Number(comic.avgRating),
    ratingCount: comic.ratingCount,
    genres: comic.genres?.map((entry) => entry.genre.name) ?? [],
    chapters,
    createdAt: comic.createdAt.toISOString(),
    updatedAt: comic.updatedAt.toISOString(),
  };
}

export async function getComics(query: ComicQuery = {}): Promise<PaginatedComics> {
  const fallback = applyMockQuery(query);
  if (!hasDatabase) return fallback;

  try {
    const page = Math.max(query.page ?? 1, 1);
    const pageSize = Math.min(Math.max(query.pageSize ?? 24, 1), 60);
    const where: Record<string, unknown> = {};
    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { synopsis: { contains: query.q, mode: 'insensitive' } },
        { author: { contains: query.q, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;
    if (query.genres?.length) {
      where.genres = { some: { genre: { name: { in: query.genres } } } };
    }

    const orderBy =
      query.sort === 'az'
        ? { title: 'asc' as const }
        : query.sort === 'rating'
          ? { avgRating: 'desc' as const }
          : query.sort === 'views'
            ? { totalViews: 'desc' as const }
            : { updatedAt: 'desc' as const };

    const [items, total] = await Promise.all([
      prisma.comic.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          genres: { include: { genre: true } },
          chapters: { orderBy: { publishedAt: 'desc' }, take: 3 },
        },
      }),
      prisma.comic.count({ where }),
    ]);

    return {
      items: items.map((comic) => mapPrismaComic(comic)),
      total,
      page,
      pageSize,
      totalPages: Math.max(Math.ceil(total / pageSize), 1),
    };
  } catch {
    return fallback;
  }
}

export async function getTrending(limit = 10) {
  return (await getComics({ sort: 'views', pageSize: limit })).items;
}

export async function getLatest(limit = 24) {
  return (await getComics({ sort: 'latest', pageSize: limit })).items;
}

export async function getComicBySlug(slug: string): Promise<ComicDTO | null> {
  const fallback = MOCK_COMICS.find((comic) => comic.slug === slug) ?? null;
  if (!hasDatabase) return fallback;

  try {
    const comic = await prisma.comic.findUnique({
      where: { slug },
      include: {
        genres: { include: { genre: true } },
        chapters: { orderBy: { publishedAt: 'desc' } },
      },
    });
    return comic ? mapPrismaComic(comic) : fallback;
  } catch {
    return fallback;
  }
}

export async function getChapter(slug: string, number: number): Promise<{ comic: ComicDTO; chapter: ChapterDTO } | null> {
  const comic = await getComicBySlug(slug);
  if (!comic) return null;
  const fallbackChapter = comic.chapters.find((chapter) => chapter.number === number) ?? null;

  if (!hasDatabase) return fallbackChapter ? { comic, chapter: fallbackChapter } : null;

  try {
    const chapter = await prisma.chapter.findFirst({
      where: { comic: { slug }, number },
      include: { pages: { orderBy: { pageNumber: 'asc' } } },
    });
    if (!chapter) return fallbackChapter ? { comic, chapter: fallbackChapter } : null;
    return {
      comic,
      chapter: {
        id: chapter.id,
        number: chapter.number,
        title: chapter.title ?? `Chapter ${chapter.number}`,
        views: chapter.views,
        publishedAt: chapter.publishedAt.toISOString(),
        pages: chapter.pages.map((page) => ({
          id: page.id,
          pageNumber: page.pageNumber,
          imageUrl: page.imageUrl,
          width: page.width ?? undefined,
          height: page.height ?? undefined,
        })),
      },
    };
  } catch {
    return fallbackChapter ? { comic, chapter: fallbackChapter } : null;
  }
}

export async function getRelatedComics(comic: ComicDTO, limit = 10) {
  return MOCK_COMICS.filter(
    (candidate) => candidate.slug !== comic.slug && candidate.genres.some((genre) => comic.genres.includes(genre)),
  ).slice(0, limit);
}

export async function getLeaderboard(period: 'weekly' | 'monthly' | 'all-time' = 'weekly') {
  const multiplier = period === 'weekly' ? 0.18 : period === 'monthly' ? 0.46 : 1;
  return [...MOCK_COMICS]
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 20)
    .map((comic, index) => ({
      ...comic,
      rank: index + 1,
      periodViews: Math.round(comic.totalViews * multiplier),
      change: index % 4 === 0 ? -1 : index % 3 === 0 ? 0 : 1,
    }));
}
