import { isDatabaseConfigured, prisma } from "./prisma";
import { getMockChapterPages, getMockComics } from "./mock-data";
import type {
  Comic,
  ComicFilters,
  LeaderboardEntry,
  PaginatedComics,
} from "./types";

/**
 * Data access layer.
 *
 * Every function attempts to read from PostgreSQL via Prisma when a real
 * database is configured. If that fails (or no DB is configured) it falls back
 * to the deterministic in-memory dataset so the application is always usable.
 */

const DEFAULT_PER_PAGE = 24;

function mapDbComic(c: any): Comic {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    altTitles: c.altTitles ?? [],
    coverImage: c.coverImage,
    bannerImage: c.bannerImage ?? undefined,
    synopsis: c.synopsis,
    status: c.status,
    type: c.type,
    author: c.author ?? undefined,
    artist: c.artist ?? undefined,
    releaseYear: c.releaseYear ?? undefined,
    totalViews: c.totalViews,
    avgRating: c.avgRating,
    ratingCount: c.ratingCount,
    featured: c.featured,
    isNew: c.isNew,
    isHot: c.isHot,
    createdAt:
      c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
    updatedAt:
      c.updatedAt instanceof Date ? c.updatedAt.toISOString() : c.updatedAt,
    genres: (c.genres ?? []).map((g: any) => g.genre ?? g),
    chapters: (c.chapters ?? []).map((ch: any) => ({
      id: ch.id,
      comicId: ch.comicId,
      number: ch.number,
      title: ch.title ?? null,
      views: ch.views,
      publishedAt:
        ch.publishedAt instanceof Date
          ? ch.publishedAt.toISOString()
          : ch.publishedAt,
    })),
  };
}

// ──────────────────────────────────────────────
// In-memory query engine (fallback)
// ──────────────────────────────────────────────
function queryMock(filters: ComicFilters): PaginatedComics {
  const {
    genres,
    status = "ALL",
    type = "ALL",
    sort = "latest",
    query,
    page = 1,
    perPage = DEFAULT_PER_PAGE,
  } = filters;

  let items = [...getMockComics()];

  if (query) {
    const q = query.toLowerCase();
    items = items.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.altTitles.some((t) => t.toLowerCase().includes(q)) ||
        (c.author ?? "").toLowerCase().includes(q)
    );
  }
  if (status && status !== "ALL") items = items.filter((c) => c.status === status);
  if (type && type !== "ALL") items = items.filter((c) => c.type === type);
  if (genres && genres.length > 0) {
    items = items.filter((c) =>
      genres.every((g) => c.genres.some((cg) => cg.slug === g))
    );
  }

  switch (sort) {
    case "az":
      items.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "rating":
      items.sort((a, b) => b.avgRating - a.avgRating);
      break;
    case "views":
      items.sort((a, b) => b.totalViews - a.totalViews);
      break;
    case "latest":
    default:
      items.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const paged = items.slice(start, start + perPage);

  return {
    items: paged,
    total,
    page,
    perPage,
    totalPages,
    hasMore: page < totalPages,
  };
}

// ──────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────
export async function getComics(filters: ComicFilters): Promise<PaginatedComics> {
  if (isDatabaseConfigured()) {
    try {
      const {
        genres,
        status = "ALL",
        type = "ALL",
        sort = "latest",
        query,
        page = 1,
        perPage = DEFAULT_PER_PAGE,
      } = filters;

      const where: any = {};
      if (status !== "ALL") where.status = status;
      if (type !== "ALL") where.type = type;
      if (query)
        where.OR = [
          { title: { contains: query, mode: "insensitive" } },
          { author: { contains: query, mode: "insensitive" } },
        ];
      if (genres && genres.length > 0)
        where.AND = genres.map((g) => ({
          genres: { some: { genre: { slug: g } } },
        }));

      const orderBy =
        sort === "az"
          ? { title: "asc" as const }
          : sort === "rating"
            ? { avgRating: "desc" as const }
            : sort === "views"
              ? { totalViews: "desc" as const }
              : { updatedAt: "desc" as const };

      const [total, rows] = await Promise.all([
        prisma.comic.count({ where }),
        prisma.comic.findMany({
          where,
          orderBy,
          skip: (page - 1) * perPage,
          take: perPage,
          include: {
            genres: { include: { genre: true } },
            chapters: { orderBy: { number: "desc" }, take: 3 },
          },
        }),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / perPage));
      return {
        items: rows.map(mapDbComic),
        total,
        page,
        perPage,
        totalPages,
        hasMore: page < totalPages,
      };
    } catch (e) {
      console.error("getComics DB error, falling back to mock:", e);
    }
  }
  return queryMock(filters);
}

export async function getComicBySlug(slug: string): Promise<Comic | null> {
  if (isDatabaseConfigured()) {
    try {
      const row = await prisma.comic.findUnique({
        where: { slug },
        include: {
          genres: { include: { genre: true } },
          chapters: { orderBy: { number: "desc" } },
        },
      });
      return row ? mapDbComic(row) : null;
    } catch (e) {
      console.error("getComicBySlug DB error, falling back to mock:", e);
    }
  }
  return getMockComics().find((c) => c.slug === slug) ?? null;
}

export async function getTrending(limit = 10): Promise<Comic[]> {
  const result = await getComics({ sort: "views", perPage: limit, page: 1 });
  return result.items.slice(0, limit);
}

export async function getLatest(limit = 18): Promise<Comic[]> {
  const result = await getComics({ sort: "latest", perPage: limit, page: 1 });
  return result.items;
}

export async function getFeatured(limit = 6): Promise<Comic[]> {
  if (isDatabaseConfigured()) {
    try {
      const rows = await prisma.comic.findMany({
        where: { featured: true },
        take: limit,
        orderBy: { totalViews: "desc" },
        include: {
          genres: { include: { genre: true } },
          chapters: { orderBy: { number: "desc" }, take: 1 },
        },
      });
      if (rows.length) return rows.map(mapDbComic);
    } catch (e) {
      console.error("getFeatured DB error, falling back to mock:", e);
    }
  }
  return getMockComics()
    .filter((c) => c.featured)
    .slice(0, limit);
}

export async function getNewTitles(limit = 12): Promise<Comic[]> {
  if (isDatabaseConfigured()) {
    try {
      const rows = await prisma.comic.findMany({
        where: { isNew: true },
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          genres: { include: { genre: true } },
          chapters: { orderBy: { number: "desc" }, take: 3 },
        },
      });
      if (rows.length) return rows.map(mapDbComic);
    } catch (e) {
      console.error("getNewTitles DB error, falling back to mock:", e);
    }
  }
  return getMockComics()
    .filter((c) => c.isNew)
    .slice(0, limit);
}

export async function getCompleted(limit = 12): Promise<Comic[]> {
  const result = await getComics({
    status: "COMPLETED",
    sort: "views",
    perPage: limit,
    page: 1,
  });
  return result.items;
}

export async function searchComics(query: string, limit = 8): Promise<Comic[]> {
  if (!query.trim()) return [];
  const result = await getComics({ query, perPage: limit, page: 1, sort: "views" });
  return result.items;
}

export async function getRelated(slug: string, limit = 8): Promise<Comic[]> {
  const comic = await getComicBySlug(slug);
  if (!comic) return [];
  const genreSlugs = new Set(comic.genres.map((g) => g.slug));
  const all = await getComics({ perPage: 100, page: 1, sort: "views" });
  return all.items
    .filter((c) => c.slug !== slug)
    .map((c) => ({
      comic: c,
      score: c.genres.filter((g) => genreSlugs.has(g.slug)).length,
    }))
    .sort((a, b) => b.score - a.score || b.comic.totalViews - a.comic.totalViews)
    .slice(0, limit)
    .map((x) => x.comic);
}

export async function getChapterPages(
  slug: string,
  chapterNumber: number
): Promise<string[]> {
  if (isDatabaseConfigured()) {
    try {
      const chapter = await prisma.chapter.findFirst({
        where: { comic: { slug }, number: chapterNumber },
        include: { pages: { orderBy: { index: "asc" } } },
      });
      if (chapter && chapter.pages.length)
        return chapter.pages.map((p) => p.imageUrl);
    } catch (e) {
      console.error("getChapterPages DB error, falling back to mock:", e);
    }
  }
  return getMockChapterPages(slug, chapterNumber);
}

export async function getLeaderboard(
  period: "weekly" | "monthly" | "alltime"
): Promise<LeaderboardEntry[]> {
  // Period weighting is simulated for the demo dataset.
  const weight = period === "weekly" ? 0.08 : period === "monthly" ? 0.3 : 1;
  const result = await getComics({ sort: "views", perPage: 20, page: 1 });
  return result.items.map((c, i) => {
    const seed = (c.slug.length * (i + 7)) % 11;
    return {
      ...c,
      rank: i + 1,
      rankChange: seed - 5, // -5..5
      periodViews: Math.floor(c.totalViews * weight),
    };
  });
}

export async function getAllGenres() {
  if (isDatabaseConfigured()) {
    try {
      const rows = await prisma.genre.findMany({ orderBy: { name: "asc" } });
      if (rows.length) return rows;
    } catch (e) {
      console.error("getAllGenres DB error, falling back to mock:", e);
    }
  }
  const { GENRES } = await import("./mock-data");
  return [...GENRES].sort((a, b) => a.name.localeCompare(b.name));
}
