import 'server-only';
import { getGoogleRefreshToken } from '@/lib/googleTokenStore';

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
  error_description?: string;
};

let cachedAccessToken: string | null = null;
let expiresAt = 0;

export async function getGoogleAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < expiresAt - 60_000) {
    return cachedAccessToken;
  }

  const refreshToken = await getGoogleRefreshToken();

  if (!refreshToken) {
    throw new Error('GOOGLE_NOT_CONNECTED');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_OAUTH_CREDENTIALS_MISSING');
  }

  const response = await fetch(
    'https://oauth2.googleapis.com/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
      cache: 'no-store',
    }
  );

  const result = (await response.json()) as GoogleTokenResponse;

  if (!response.ok || !result.access_token) {
    console.error('Google token refresh failed', {
      status: response.status,
      error: result.error ?? 'unknown',
    });
    throw new Error('GOOGLE_TOKEN_REFRESH_FAILED');
  }

  cachedAccessToken = result.access_token;
  expiresAt = Date.now() + (result.expires_in ?? 3600) * 1000;

  return result.access_token;
}

