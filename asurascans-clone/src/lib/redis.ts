import { Redis } from "@upstash/redis";

/**
 * Upstash Redis cache for hot data (trending, latest, leaderboard).
 *
 * When Upstash credentials are not present we fall back to a tiny in-process
 * Map-based cache so the caching code paths still work in local/dev/demo mode.
 */
interface CacheLike {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, opts?: { ex?: number }): Promise<unknown>;
}

class MemoryCache implements CacheLike {
  private store = new Map<string, { value: unknown; expiresAt: number | null }>();

  async get<T>(key: string): Promise<T | null> {
    const hit = this.store.get(key);
    if (!hit) return null;
    if (hit.expiresAt && hit.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return hit.value as T;
  }

  async set<T>(key: string, value: T, opts?: { ex?: number }): Promise<unknown> {
    this.store.set(key, {
      value,
      expiresAt: opts?.ex ? Date.now() + opts.ex * 1000 : null,
    });
    return "OK";
  }
}

function createCache(): CacheLike {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return new Redis({ url, token }) as unknown as CacheLike;
  }
  return new MemoryCache();
}

const globalForCache = globalThis as unknown as { cache: CacheLike | undefined };
export const cache = globalForCache.cache ?? createCache();
if (process.env.NODE_ENV !== "production") globalForCache.cache = cache;

/** Read-through cache helper. */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>
): Promise<T> {
  try {
    const hit = await cache.get<T>(key);
    if (hit !== null && hit !== undefined) return hit;
  } catch {
    // ignore cache read errors
  }
  const value = await loader();
  try {
    await cache.set(key, value, { ex: ttlSeconds });
  } catch {
    // ignore cache write errors
  }
  return value;
}
