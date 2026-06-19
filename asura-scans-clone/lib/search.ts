import { Meilisearch } from "meilisearch";
import { listComics } from "@/lib/comics";
import type { Comic } from "@/types/comic";

let meiliClient: Meilisearch | null = null;

function getMeiliClient() {
  if (!process.env.MEILISEARCH_HOST || !process.env.MEILISEARCH_API_KEY) {
    return null;
  }

  if (!meiliClient) {
    meiliClient = new Meilisearch({
      host: process.env.MEILISEARCH_HOST,
      apiKey: process.env.MEILISEARCH_API_KEY
    });
  }

  return meiliClient;
}

export async function searchComics(query: string, limit = 10): Promise<Comic[]> {
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  const client = getMeiliClient();
  if (client) {
    const index = client.index<Comic>(process.env.MEILISEARCH_INDEX_NAME ?? "comics");
    const results = await index.search(trimmed, {
      limit,
      attributesToRetrieve: ["*"]
    });

    return results.hits;
  }

  const result = await listComics({
    q: trimmed,
    pageSize: limit,
    sort: "rating"
  });

  return result.items;
}
