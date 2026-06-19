import { Redis } from "@upstash/redis";

/**
 * Upstash Redis cache wrapper for hot data (trending, latest, etc.).
 * Falls back to a process-local in-memory cache when Upstash is not configured,
 * so the app works out-of-the-box in development.
 */

type CacheEntry = { value: unknown; expires: number };
const memoryStore = new Map<string, CacheEntry>();

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    if (redis) {
      return (await redis.get<T>(key)) ?? null;
    }
    const entry = memoryStore.get(key);
    if (!entry) return null;
    if (entry.expires < Date.now()) {
      memoryStore.delete(key);
      return null;
    }
    return entry.value as T;
  } catch {
    return null;
  }
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
  try {
    if (redis) {
      await redis.set(key, value, { ex: ttlSeconds });
      return;
    }
    memoryStore.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
  } catch {
    /* swallow cache errors */
  }
}

/** Get from cache or compute and store. */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  compute: () => Promise<T>,
): Promise<T> {
  const hit = await cacheGet<T>(key);
  if (hit !== null) return hit;
  const value = await compute();
  await cacheSet(key, value, ttlSeconds);
  return value;
}
