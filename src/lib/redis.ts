import { Redis } from '@upstash/redis';

let redisClient: Redis | undefined;

function getRedisClient(): Redis {
  if (redisClient) return redisClient;

  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      'Missing Upstash Redis REST URL or write token.'
    );
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}

export const redis: Redis = new Proxy({} as Redis, {
  get(_target, prop) {
    if (prop === 'then') return undefined;
    const client = getRedisClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
