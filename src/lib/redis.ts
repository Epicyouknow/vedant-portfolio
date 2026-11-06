import { Redis } from '@upstash/redis';

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

/**
 * Validates and retrieves the Upstash Redis client.
 * Supports both Vercel KV credentials (KV_REST_API_URL/TOKEN) 
 * and native Upstash credentials (UPSTASH_REDIS_REST_URL/TOKEN).
 */
function getRedisClient(): Redis {
  const currentUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const currentToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!currentUrl || !currentToken) {
    throw new Error('Missing KV_REST_API_URL or KV_REST_API_TOKEN');
  }

  return new Redis({
    url: currentUrl,
    token: currentToken,
  });
}

// Direct client when environment credentials are present, 
// or guarded proxy to prevent crashing during build time when env vars are being configured.
export const redis: Redis = (url && token)
  ? new Redis({ url, token })
  : new Proxy({} as Redis, {
      get(_target, prop) {
        const client = getRedisClient();
        const value = (client as any)[prop];
        return typeof value === 'function' ? value.bind(client) : value;
      },
    });

