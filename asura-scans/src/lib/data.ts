import { prisma, isDatabaseConfigured } from "./prisma";
import { comicInclude, mapComicToCard, mapComicToDetail } from "./mappers";
import {
  GENRES,
  MOCK_COMICS,
  getMockChapters,
  getMockPageImages,
  toCard,
} from "./mock-data";
import type {
  ChapterDTO,
  ComicCardDTO,
  ComicDetailDTO,
  ComicFilters,
  ComicListResult,
  GenreDTO,
  LeaderboardEntryDTO,
  LeaderboardPeriod,
  PageImageDTO,
} from "./types";

/**
 * Data-access layer. Each function attempts a Prisma query when a database is
 * configured and falls back to the deterministic mock dataset otherwise (or if
 * the query throws). This keeps the UI fully functional in any environment.
 */

const dbEnabled = () => isDatabaseConfigured();

// ───────────────────────────── GENRES ─────────────────────────────

export async function getGenres(): Promise<GenreDTO[]> {
  if (dbEnabled()) {
    try {
      const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });
      if (genres.length) return genres;
    } catch {
      /* fall back */
    }
  }
  return [...GENRES].sort((a, b) => a.name.localeCompare(b.name));
}

// ───────────────────────────── LISTS ─────────────────────────────

function applyMockFilters(filters: ComicFilters): ComicDetailDTO[] {
  let list = [...MOCK_COMICS];
  if (filters.status) list = list.filter((c) => c.status === filters.status);
  if (filters.type) list = list.filter((c) => c.type === filters.type);
  if (filters.genres?.length) {
    list = list.filter((c) =>
      filters.genres!.every((g) => c.genres.some((cg) => cg.slug === g)),
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.altTitles.some((t) => t.toLowerCase().includes(q)),
    );
  }
  switch (filters.sort) {
    case "az":
      list.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "rating":
      list.sort((a, b) => b.avgRating - a.avgRating);
      break;
    case "views":
      list.sort((a, b) => b.totalViews - a.totalViews);
      break;
    case "latest":
    default:
      list.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }
  return list;
}

export async function getComics(filters: ComicFilters = {}): Promise<ComicListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(60, filters.pageSize ?? 24);
  const skip = (page - 1) * pageSize;

  if (dbEnabled()) {
    try {
      const orderBy =
        filters.sort === "az"
          ? { title: "asc" as const }
          : filters.sort === "rating"
            ? { avgRating: "desc" as const }
            : filters.sort === "views"
              ? { totalViews: "desc" as const }
              : { updatedAt: "desc" as const };

      const where = {
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.search
          ? { title: { contains: filters.search, mode: "insensitive" as const } }
          : {}),
        ...(filters.genres?.length
          ? {
              AND: filters.genres.map((slug) => ({
                genres: { some: { genre: { slug } } },
              })),
            }
          : {}),
      };

      const [rows, total] = await Promise.all([
        prisma.comic.findMany({ where, include: comicInclude, orderBy, skip, take: pageSize }),
        prisma.comic.count({ where }),
      ]);
      return {
        comics: rows.map(mapComicToCard),
        total,
        page,
        pageSize,
        hasMore: skip + rows.length < total,
      };
    } catch {
      /* fall back */
    }
  }

  const filtered = applyMockFilters(filters);
  const slice = filtered.slice(skip, skip + pageSize).map(toCard);
  return {
    comics: slice,
    total: filtered.length,
    page,
    pageSize,
    hasMore: skip + slice.length < filtered.length,
  };
}

export async function getTrending(limit = 10): Promise<ComicCardDTO[]> {
  if (dbEnabled()) {
    try {
      const rows = await prisma.comic.findMany({
        include: comicInclude,
        orderBy: { weeklyViews: "desc" },
        take: limit,
      });
      if (rows.length) return rows.map(mapComicToCard);
    } catch {
      /* fall back */
    }
  }
  return [...MOCK_COMICS]
    .sort((a, b) => b.weeklyViews - a.weeklyViews)
    .slice(0, limit)
    .map(toCard);
}

export async function getLatest(limit = 18): Promise<ComicCardDTO[]> {
  if (dbEnabled()) {
    try {
      const rows = await prisma.comic.findMany({
        include: comicInclude,
        orderBy: { updatedAt: "desc" },
        take: limit,
      });
      if (rows.length) return rows.map(mapComicToCard);
    } catch {
      /* fall back */
    }
  }
  return [...MOCK_COMICS]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit)
    .map(toCard);
}

export async function getNewTitles(limit = 12): Promise<ComicCardDTO[]> {
  if (dbEnabled()) {
    try {
      const rows = await prisma.comic.findMany({
        include: comicInclude,
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      if (rows.length) return rows.map(mapComicToCard).map((c) => ({ ...c, isNew: true }));
    } catch {
      /* fall back */
    }
  }
  return [...MOCK_COMICS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
    .map(toCard)
    .map((c) => ({ ...c, isNew: true }));
}

export async function getCompleted(limit = 12): Promise<ComicCardDTO[]> {
  if (dbEnabled()) {
    try {
      const rows = await prisma.comic.findMany({
        where: { status: "COMPLETED" },
        include: comicInclude,
        orderBy: { totalViews: "desc" },
        take: limit,
      });
      if (rows.length) return rows.map(mapComicToCard);
    } catch {
      /* fall back */
    }
  }
  return [...MOCK_COMICS]
    .filter((c) => c.status === "COMPLETED")
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, limit)
    .map(toCard);
}

export async function getFeatured(limit = 5): Promise<ComicDetailDTO[]> {
  if (dbEnabled()) {
    try {
      const rows = await prisma.comic.findMany({
        where: { isFeatured: true },
        include: comicInclude,
        orderBy: { weeklyViews: "desc" },
        take: limit,
      });
      if (rows.length) return rows.map(mapComicToDetail);
    } catch {
      /* fall back */
    }
  }
  return [...MOCK_COMICS].sort((a, b) => b.weeklyViews - a.weeklyViews).slice(0, limit);
}

// ───────────────────────────── DETAIL ─────────────────────────────

export async function getComicBySlug(slug: string): Promise<ComicDetailDTO | null> {
  if (dbEnabled()) {
    try {
      const row = await prisma.comic.findUnique({ where: { slug }, include: comicInclude });
      if (row) return mapComicToDetail(row);
    } catch {
      /* fall back */
    }
  }
  return MOCK_COMICS.find((c) => c.slug === slug) ?? null;
}

export async function getChapters(slug: string): Promise<ChapterDTO[]> {
  if (dbEnabled()) {
    try {
      const comic = await prisma.comic.findUnique({
        where: { slug },
        select: {
          chapters: {
            orderBy: { number: "desc" },
            include: { _count: { select: { pages: true } } },
          },
        },
      });
      if (comic) {
        return comic.chapters.map((ch) => ({
          id: ch.id,
          number: ch.number,
          title: ch.title,
          views: ch.views,
          publishedAt: ch.publishedAt.toISOString(),
          pageCount: ch._count.pages,
        }));
      }
    } catch {
      /* fall back */
    }
  }
  return getMockChapters(slug);
}

export async function getChapter(
  slug: string,
  chapterNumber: number,
): Promise<{ chapter: ChapterDTO; pages: PageImageDTO[] } | null> {
  if (dbEnabled()) {
    try {
      const comic = await prisma.comic.findUnique({ where: { slug }, select: { id: true } });
      if (comic) {
        const ch = await prisma.chapter.findUnique({
          where: { comicId_number: { comicId: comic.id, number: chapterNumber } },
          include: { pages: { orderBy: { pageIndex: "asc" } } },
        });
        if (ch) {
          return {
            chapter: {
              id: ch.id,
              number: ch.number,
              title: ch.title,
              views: ch.views,
              publishedAt: ch.publishedAt.toISOString(),
              pageCount: ch.pages.length,
            },
            pages: ch.pages.map((p) => ({
              pageIndex: p.pageIndex,
              imageUrl: p.imageUrl,
              width: p.width ?? undefined,
              height: p.height ?? undefined,
            })),
          };
        }
      }
    } catch {
      /* fall back */
    }
  }
  const chapters = getMockChapters(slug);
  const chapter = chapters.find((c) => c.number === chapterNumber);
  if (!chapter) return null;
  return { chapter, pages: getMockPageImages(slug, chapterNumber) };
}

export async function getChapterPagesById(chapterId: string): Promise<PageImageDTO[] | null> {
  if (dbEnabled()) {
    try {
      const pages = await prisma.chapterPage.findMany({
        where: { chapterId },
        orderBy: { pageIndex: "asc" },
      });
      if (pages.length) {
        return pages.map((p) => ({
          pageIndex: p.pageIndex,
          imageUrl: p.imageUrl,
          width: p.width ?? undefined,
          height: p.height ?? undefined,
        }));
      }
    } catch {
      /* fall back */
    }
  }
  // Mock chapter ids are formatted as `${slug}-ch-${number}`.
  const match = chapterId.match(/^(.*)-ch-(\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const [, slug, num] = match;
  const result = await getChapter(slug, Number(num));
  return result?.pages ?? null;
}

export async function getRelated(slug: string, limit = 12): Promise<ComicCardDTO[]> {
  const comic = await getComicBySlug(slug);
  if (!comic) return [];
  if (dbEnabled()) {
    try {
      const rows = await prisma.comic.findMany({
        where: {
          slug: { not: slug },
          genres: { some: { genre: { slug: { in: comic.genres.map((g) => g.slug) } } } },
        },
        include: comicInclude,
        orderBy: { totalViews: "desc" },
        take: limit,
      });
      if (rows.length) return rows.map(mapComicToCard);
    } catch {
      /* fall back */
    }
  }
  const genreSlugs = new Set(comic.genres.map((g) => g.slug));
  return MOCK_COMICS.filter(
    (c) => c.slug !== slug && c.genres.some((g) => genreSlugs.has(g.slug)),
  )
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, limit)
    .map(toCard);
}

// ───────────────────────────── SEARCH ─────────────────────────────

export async function searchComics(query: string, limit = 8): Promise<ComicCardDTO[]> {
  const q = query.trim();
  if (!q) return [];
  if (dbEnabled()) {
    try {
      const rows = await prisma.comic.findMany({
        where: { title: { contains: q, mode: "insensitive" } },
        include: comicInclude,
        orderBy: { totalViews: "desc" },
        take: limit,
      });
      return rows.map(mapComicToCard);
    } catch {
      /* fall back */
    }
  }
  const lower = q.toLowerCase();
  return MOCK_COMICS.filter(
    (c) =>
      c.title.toLowerCase().includes(lower) ||
      c.altTitles.some((t) => t.toLowerCase().includes(lower)),
  )
    .slice(0, limit)
    .map(toCard);
}

// ─────────────────────────── LEADERBOARD ───────────────────────────

export async function getLeaderboard(
  period: LeaderboardPeriod,
  limit = 20,
): Promise<LeaderboardEntryDTO[]> {
  const viewField =
    period === "WEEKLY" ? "weeklyViews" : period === "MONTHLY" ? "monthlyViews" : "totalViews";

  let cards: ComicCardDTO[];
  let metric: (slug: string) => number;

  if (dbEnabled()) {
    try {
      const rows = await prisma.comic.findMany({
        include: comicInclude,
        orderBy: { [viewField]: "desc" },
        take: limit,
      });
      if (rows.length) {
        const map = new Map(rows.map((r) => [r.slug, (r as any)[viewField] as number]));
        cards = rows.map(mapComicToCard);
        metric = (slug) => map.get(slug) ?? 0;
        return buildLeaderboard(cards, metric, period);
      }
    } catch {
      /* fall back */
    }
  }

  const sorted = [...MOCK_COMICS].sort((a, b) => (b as any)[viewField] - (a as any)[viewField]);
  cards = sorted.slice(0, limit).map(toCard);
  metric = (slug) => {
    const c = MOCK_COMICS.find((x) => x.slug === slug);
    return c ? (c as any)[viewField] : 0;
  };
  return buildLeaderboard(cards, metric, period);
}

function buildLeaderboard(
  cards: ComicCardDTO[],
  metric: (slug: string) => number,
  period: LeaderboardPeriod,
): LeaderboardEntryDTO[] {
  const seedBase = period === "WEEKLY" ? 7 : period === "MONTHLY" ? 13 : 23;
  return cards.map((c, i) => {
    // Deterministic pseudo rank-change indicator.
    const h = (c.slug.length * seedBase + i * 3) % 7;
    const rankChange = h === 0 ? 0 : h <= 3 ? h : -(h - 3);
    return {
      ...c,
      rank: i + 1,
      rankChange,
      periodViews: metric(c.slug),
    };
  });
}
