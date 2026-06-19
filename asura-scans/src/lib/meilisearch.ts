import { Meilisearch } from "meilisearch";

let client: Meilisearch | null = null;

export function getMeiliSearch(): Meilisearch | null {
  if (client) return client;

  const host = process.env.MEILISEARCH_HOST;
  const apiKey = process.env.MEILISEARCH_API_KEY;

  if (!host) return null;

  client = new Meilisearch({ host, apiKey });
  return client;
}

export const COMICS_INDEX = "comics";

export async function searchComics(query: string, limit = 20) {
  const meili = getMeiliSearch();
  if (!meili) return null;

  try {
    const index = meili.index(COMICS_INDEX);
    const results = await index.search(query, { limit });
    return results.hits;
  } catch {
    return null;
  }
}
