import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

export function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  if (!redis) {
    redis = Redis.fromEnv();
  }

  return redis;
}

export async function cached<T>(key: string, ttlSeconds: number, loader: () => Promise<T>): Promise<T> {
  const client = getRedis();

  if (!client) {
    return loader();
  }

  const cachedValue = await client.get<T>(key);
  if (cachedValue) {
    return cachedValue;
  }

  const value = await loader();
  await client.set(key, value, { ex: ttlSeconds });
  return value;
}
