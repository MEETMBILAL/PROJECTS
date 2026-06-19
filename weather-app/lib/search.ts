import { liteClient as algoliasearch } from "algoliasearch/lite";

import { queryComics } from "@/lib/mock-data";

export async function searchComics(query: string) {
  const appId = process.env.ALGOLIA_APP_ID;
  const apiKey = process.env.ALGOLIA_SEARCH_API_KEY;
  const indexName = process.env.ALGOLIA_INDEX_NAME ?? "comics";

  if (!query.trim()) {
    return [];
  }

  if (appId && apiKey) {
    try {
      const client = algoliasearch(appId, apiKey);
      const response = await client.searchSingleIndex({
        indexName,
        searchParams: { query, hitsPerPage: 12 },
      });
      return response.hits;
    } catch {
      // The local catalogue fallback keeps search usable during setup.
    }
  }

  return queryComics({ q: query, pageSize: 12 }).items;
}
