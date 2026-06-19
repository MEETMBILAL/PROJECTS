import { cached } from "@/lib/redis";
import { getPrisma } from "@/lib/prisma";
import { comics as mockComics, getChapter, getComicBySlug, getPagesForChapter } from "@/lib/mock-data";
import type { ChapterPage, Comic, ComicListResponse, ComicStatus, ComicType } from "@/types/comic";

type ListParams = {
  page?: number;
  pageSize?: number;
  genre?: string[];
  status?: ComicStatus;
  type?: ComicType;
  sort?: "latest" | "az" | "rating" | "views";
  q?: string;
};

function mapComic(comic: any): Comic {
  return {
    id: comic.id,
    slug: comic.slug,
    title: comic.title,
    altTitles: comic.altTitles ?? [],
    coverImage: comic.coverImage,
    bannerImage: comic.bannerImage ?? undefined,
    synopsis: comic.synopsis,
    status: comic.status,
    type: comic.type,
    author: comic.author,
    artist: comic.artist,
    releaseYear: comic.releaseYear,
    totalViews: comic.totalViews,
    avgRating: comic.avgRating,
    ratingCount: comic.ratingCount,
    genres: (comic.genres ?? []).map((entry: any) => entry.genre ?? entry),
    chapters: (comic.chapters ?? []).map((chapter: any) => ({
      id: chapter.id,
      number: chapter.number,
      title: chapter.title,
      views: chapter.views,
      publishedAt: chapter.publishedAt instanceof Date ? chapter.publishedAt.toISOString() : chapter.publishedAt
    })),
    createdAt: comic.createdAt instanceof Date ? comic.createdAt.toISOString() : comic.createdAt,
    updatedAt: comic.updatedAt instanceof Date ? comic.updatedAt.toISOString() : comic.updatedAt
  };
}

function filterMock(params: ListParams): Comic[] {
  const query = params.q?.toLowerCase().trim();
  let items = [...mockComics];

  if (query) {
    items = items.filter(
      (comic) =>
        comic.title.toLowerCase().includes(query) ||
        comic.altTitles.some((title) => title.toLowerCase().includes(query)) ||
        comic.genres.some((genre) => genre.name.toLowerCase().includes(query))
    );
  }

  if (params.genre?.length) {
    const requested = new Set(params.genre);
    items = items.filter((comic) => comic.genres.some((genre) => requested.has(genre.slug)));
  }

  if (params.status) {
    items = items.filter((comic) => comic.status === params.status);
  }

  if (params.type) {
    items = items.filter((comic) => comic.type === params.type);
  }

  switch (params.sort) {
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
      items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  return items;
}

export async function listComics(params: ListParams = {}): Promise<ComicListResponse> {
  const page = Math.max(params.page ?? 1, 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? 24, 1), 60);
  const prisma = getPrisma();

  if (!prisma) {
    const filtered = filterMock(params);
    const start = (page - 1) * pageSize;
    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
      hasMore: start + pageSize < filtered.length
    };
  }

  const where: any = {
    ...(params.status ? { status: params.status } : {}),
    ...(params.type ? { type: params.type } : {}),
    ...(params.q
      ? {
          OR: [
            { title: { contains: params.q, mode: "insensitive" } },
            { synopsis: { contains: params.q, mode: "insensitive" } },
            { altTitles: { has: params.q } }
          ]
        }
      : {}),
    ...(params.genre?.length
      ? {
          genres: {
            some: {
              genre: {
                slug: { in: params.genre }
              }
            }
          }
        }
      : {})
  };

  const orderBy =
    params.sort === "az"
      ? { title: "asc" as const }
      : params.sort === "rating"
        ? { avgRating: "desc" as const }
        : params.sort === "views"
          ? { totalViews: "desc" as const }
          : { updatedAt: "desc" as const };

  const [items, total] = await Promise.all([
    prisma.comic.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        genres: { include: { genre: true } },
        chapters: { orderBy: { publishedAt: "desc" }, take: 3 }
      }
    }),
    prisma.comic.count({ where })
  ]);

  return {
    items: items.map(mapComic),
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total
  };
}

export async function getTrendingComics() {
  return cached("trending:top10", 60, async () => {
    const prisma = getPrisma();
    if (!prisma) {
      return [...mockComics].sort((a, b) => b.totalViews - a.totalViews).slice(0, 10);
    }

    const items = await prisma.comic.findMany({
      orderBy: [{ totalViews: "desc" }, { avgRating: "desc" }],
      take: 10,
      include: {
        genres: { include: { genre: true } },
        chapters: { orderBy: { publishedAt: "desc" }, take: 3 }
      }
    });

    return items.map(mapComic);
  });
}

export async function getLatestComics(limit = 18) {
  const result = await listComics({ sort: "latest", pageSize: limit });
  return result.items;
}

export async function getNewComics(limit = 12) {
  const result = await listComics({ sort: "latest", pageSize: limit });
  return result.items;
}

export async function getCompletedComics(limit = 12) {
  const result = await listComics({ status: "COMPLETED", sort: "rating", pageSize: limit });
  return result.items;
}

export async function getComicDetail(slug: string) {
  const prisma = getPrisma();

  if (!prisma) {
    return getComicBySlug(slug) ?? null;
  }

  const comic = await prisma.comic.findUnique({
    where: { slug },
    include: {
      genres: { include: { genre: true } },
      chapters: { orderBy: { number: "desc" } }
    }
  });

  return comic ? mapComic(comic) : null;
}

export async function getComicChapters(slug: string) {
  const comic = await getComicDetail(slug);
  return comic?.chapters ?? [];
}

export async function getReaderData(slug: string, num: number) {
  const prisma = getPrisma();

  if (!prisma) {
    const comic = getComicBySlug(slug);
    const chapter = getChapter(slug, num);
    return comic && chapter
      ? {
          comic,
          chapter,
          pages: getPagesForChapter(chapter.id),
          chapters: comic.chapters
        }
      : null;
  }

  const comic = await prisma.comic.findUnique({
    where: { slug },
    include: {
      chapters: {
        orderBy: { number: "asc" },
        include: {
          pages: { orderBy: { pageIndex: "asc" } }
        }
      }
    }
  });

  const chapter = comic?.chapters.find((item) => item.number === num);

  if (!comic || !chapter) {
    return null;
  }

  return {
    comic: mapComic(comic),
    chapter: {
      id: chapter.id,
      number: chapter.number,
      title: chapter.title,
      views: chapter.views,
      publishedAt: chapter.publishedAt.toISOString()
    },
    pages: chapter.pages.map((page) => ({
      id: page.id,
      pageIndex: page.pageIndex,
      imageUrl: page.imageUrl,
      width: page.width ?? undefined,
      height: page.height ?? undefined
    })) satisfies ChapterPage[],
    chapters: comic.chapters.map((item) => ({
      id: item.id,
      number: item.number,
      title: item.title,
      views: item.views,
      publishedAt: item.publishedAt.toISOString()
    }))
  };
}

export async function getRelatedComics(slug: string) {
  const comic = await getComicDetail(slug);
  if (!comic) {
    return [];
  }

  const genreSlugs = comic.genres.map((genre) => genre.slug);
  return filterMock({ genre: genreSlugs })
    .filter((item) => item.slug !== slug)
    .slice(0, 10);
}
