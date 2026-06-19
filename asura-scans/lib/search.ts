// eslint-disable-next-line @typescript-eslint/no-explicit-any
let meiliClient: any = null;

async function getMeiliClient() {
  if (meiliClient) return meiliClient;
  const host = process.env.MEILISEARCH_HOST;
  const apiKey = process.env.MEILISEARCH_API_KEY;
  if (!host || !apiKey) return null;
  try {
    const { Meilisearch } = await import("meilisearch");
    meiliClient = new Meilisearch({ host, apiKey });
    return meiliClient;
  } catch {
    return null;
  }
}

export const COMICS_INDEX = "comics";

export async function indexComic(comic: {
  id: string;
  slug: string;
  title: string;
  altTitles: string[];
  coverImage: string;
  status: string;
  type: string;
  avgRating: number;
}) {
  const meili = await getMeiliClient();
  if (!meili) return;
  try {
    const index = meili.index(COMICS_INDEX);
    await index.addDocuments([
      {
        id: comic.id,
        slug: comic.slug,
        title: comic.title,
        altTitles: comic.altTitles,
        coverImage: comic.coverImage,
        status: comic.status,
        type: comic.type,
        avgRating: comic.avgRating,
      },
    ]);
  } catch {
    // search indexing is optional
  }
}

export async function searchComics(query: string, limit = 20) {
  const meili = await getMeiliClient();
  if (!meili) return null;
  try {
    const index = meili.index(COMICS_INDEX);
    const result = await index.search(query, { limit });
    return result.hits as Array<{ id: string; slug: string; title: string; coverImage: string }>;
  } catch {
    return null;
  }
}
