import { Meilisearch } from "meilisearch";
import { prisma } from "./prisma";

let meili: Meilisearch | null = null;

function getMeili(): Meilisearch | null {
  if (meili) return meili;
  const host = process.env.MEILISEARCH_HOST;
  const apiKey = process.env.MEILISEARCH_API_KEY;
  if (!host) return null;
  meili = new Meilisearch({ host, apiKey: apiKey ?? "" });
  return meili;
}

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  latestChapter?: number;
}

export async function searchComics(
  query: string,
  limit = 20
): Promise<SearchResult[]> {
  const client = getMeili();
  if (client) {
    try {
      const index = client.index("comics");
      const results = await index.search(query, { limit });
      return results.hits as SearchResult[];
    } catch {
      // fall through to DB search
    }
  }

  const comics = await prisma.comic.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { author: { contains: query, mode: "insensitive" } },
      ],
    },
    take: limit,
    include: {
      chapters: { orderBy: { number: "desc" }, take: 1 },
    },
  });

  return comics.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    coverImage: c.coverImage,
    latestChapter: c.chapters[0]?.number,
  }));
}

export async function indexComic(comic: {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  author?: string | null;
}) {
  const client = getMeili();
  if (!client) return;
  try {
    const index = client.index("comics");
    await index.addDocuments([comic]);
  } catch {
    // ignore
  }
}
