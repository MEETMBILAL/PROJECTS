import { algoliasearch } from 'algoliasearch';
import { MeiliSearch } from 'meilisearch';
import { MOCK_COMICS } from '@/lib/mock-data';
import type { ComicDTO } from '@/lib/types';

export async function searchComicsIndex(query: string): Promise<ComicDTO[]> {
  const q = query.trim();
  if (!q) return [];

  if (process.env.MEILISEARCH_HOST) {
    try {
      const client = new MeiliSearch({
        host: process.env.MEILISEARCH_HOST,
        apiKey: process.env.MEILISEARCH_API_KEY,
      });
      const result = await client.index('comics').search<ComicDTO>(q, { limit: 12 });
      return result.hits;
    } catch {
      // Fall through to the in-memory index when external search is unavailable.
    }
  }

  if (process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_SEARCH_API_KEY) {
    try {
      const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_API_KEY);
      const result = await client.searchSingleIndex<ComicDTO>({
        indexName: process.env.ALGOLIA_INDEX_NAME ?? 'comics',
        searchParams: { query: q, hitsPerPage: 12 },
      });
      return result.hits;
    } catch {
      // Fall through to local search.
    }
  }

  const needle = q.toLowerCase();
  return MOCK_COMICS.filter((comic) =>
    [comic.title, comic.synopsis, comic.author, comic.artist, ...comic.genres].some((value) =>
      value.toLowerCase().includes(needle),
    ),
  ).slice(0, 12);
}
