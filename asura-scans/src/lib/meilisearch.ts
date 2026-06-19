import { Meilisearch } from "meilisearch";

export const meili =
  process.env.MEILISEARCH_HOST && process.env.MEILISEARCH_API_KEY
    ? new Meilisearch({
        host: process.env.MEILISEARCH_HOST,
        apiKey: process.env.MEILISEARCH_API_KEY,
      })
    : null;

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
  latestChapter?: number;
}) {
  if (!meili) return;
  const index = meili.index(COMICS_INDEX);
  await index.addDocuments([comic]);
}

export async function searchComics(query: string, limit = 20) {
  if (!meili) return null;
  const index = meili.index(COMICS_INDEX);
  return index.search(query, { limit });
}
