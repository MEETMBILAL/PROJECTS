import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis =
  url && token ? new Redis({ url, token }) : null;

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 300
): Promise<T> {
  if (!redis) return fetcher();

  try {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) return cached;

    const data = await fetcher();
    await redis.set(key, data, { ex: ttlSeconds });
    return data;
  } catch {
    return fetcher();
  }
}

export async function invalidateCache(pattern: string) {
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch {
    // ignore cache errors
  }
}
