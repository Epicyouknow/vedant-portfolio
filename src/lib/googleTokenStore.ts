import 'server-only';

import { redis } from './redis';
import {
  encryptGoogleToken,
  decryptGoogleToken,
} from './googleTokenEncryption';

const REFRESH_TOKEN_KEY = 'vedantverse:google:refresh-token';

export async function saveGoogleRefreshToken(
  refreshToken: string
): Promise<void> {
  if (!refreshToken?.trim()) {
    throw new Error('Google refresh token is required.');
  }

  const encryptedToken = encryptGoogleToken(refreshToken);

  await redis.set(REFRESH_TOKEN_KEY, encryptedToken);
}

export async function getGoogleRefreshToken(): Promise<string | null> {
  const encryptedToken = await redis.get<string>(REFRESH_TOKEN_KEY);

  if (!encryptedToken) {
    return null;
  }

  return decryptGoogleToken(encryptedToken);
}

export async function deleteGoogleRefreshToken(): Promise<void> {
  await redis.del(REFRESH_TOKEN_KEY);
}

export async function hasGoogleRefreshToken(): Promise<boolean> {
  const exists = await redis.exists(REFRESH_TOKEN_KEY);
  return Number(exists) > 0;
}
