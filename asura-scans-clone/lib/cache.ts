import { Redis } from "@upstash/redis";

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export async function getCached<T>(key: string, fallback: () => Promise<T>, ttl = 60): Promise<T> {
  if (!redis) return fallback();
  const cached = await redis.get<T>(key);
  if (cached) return cached;
  const value = await fallback();
  await redis.set(key, value, { ex: ttl });
  return value;
}
