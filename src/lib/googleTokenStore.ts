import { redis } from '@/lib/redis';
import { encryptGoogleToken, decryptGoogleToken } from '@/lib/googleTokenEncryption';

// Fixed integration key to avoid arbitrary user-provided keys
const GOOGLE_REFRESH_TOKEN_KEY = 'vedantverse:google:refresh_token';

/**
 * Encrypts and saves the Google OAuth refresh token in Upstash Redis.
 */
export async function saveGoogleRefreshToken(token: string): Promise<void> {
  if (!token) {
    throw new Error('Google refresh token cannot be empty.');
  }

  const encrypted = encryptGoogleToken(token);
  await redis.set(GOOGLE_REFRESH_TOKEN_KEY, encrypted);
}

/**
 * Retrieves and decrypts the stored Google OAuth refresh token from Upstash Redis.
 * Returns null if no token exists.
 */
export async function getGoogleRefreshToken(): Promise<string | null> {
  const encrypted = await redis.get<string>(GOOGLE_REFRESH_TOKEN_KEY);
  if (!encrypted) {
    return null;
  }

  return decryptGoogleToken(encrypted);
}

/**
 * Securely deletes the stored Google OAuth refresh token from Upstash Redis.
 */
export async function deleteGoogleRefreshToken(): Promise<void> {
  await redis.del(GOOGLE_REFRESH_TOKEN_KEY);
}
