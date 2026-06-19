import { Meilisearch } from "meilisearch";

import { searchComics } from "@/lib/mock-data";

const client = process.env.MEILISEARCH_HOST
  ? new Meilisearch({
      host: process.env.MEILISEARCH_HOST,
      apiKey: process.env.MEILISEARCH_API_KEY,
    })
  : null;

export async function searchIndex(query: string) {
  if (!query.trim()) return [];
  if (!client) return searchComics(query);

  try {
    const index = client.index(process.env.MEILISEARCH_COMICS_INDEX ?? "comics");
    const result = await index.search(query, { limit: 20 });
    return result.hits;
  } catch {
    return searchComics(query);
  }
}
