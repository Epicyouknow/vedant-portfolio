import 'server-only';
import crypto from 'crypto';

export interface MetaCapiUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
}

export interface MetaCapiCustomData {
  content_name?: string;
  content_category?: string;
  value?: number | string;
  currency?: string;
  status?: string;
  [key: string]: any;
}

export interface MetaCapiEventPayload {
  event_name: 'Lead' | 'PageView' | 'ViewContent' | 'Contact' | string;
  event_id: string;
  event_time?: number;
  event_source_url?: string;
  user_data?: MetaCapiUserData;
  custom_data?: MetaCapiCustomData;
}

export interface MetaCapiResult {
  success: boolean;
  skipped?: boolean;
  events_received?: number;
  fbtrace_id?: string;
  error?: string;
}

/**
 * Normalises and hashes a string using SHA-256 according to Meta specs.
 * Strings must be trimmed and converted to lowercase before hashing.
 */
function hashSha256(value?: string): string | undefined {
  if (!value) return undefined;
  const clean = value.trim().toLowerCase();
  if (!clean) return undefined;
  return crypto.createHash('sha256').update(clean).digest('hex');
}

/**
 * Normalises a phone number to digits only (E.164-compatible) and hashes with SHA-256.
 * If 10 digits without country code (common in India), prefixes '91'.
 */
function hashPhone(phone?: string): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;
  if (digits.length === 10) {
    digits = `91${digits}`;
  }
  return crypto.createHash('sha256').update(digits).digest('hex');
}

/**
 * Sends a server-side event to the Meta Conversions API (CAPI).
 * Environment variables are read only server-side.
 * Tokens are never logged, returned, or exposed to the client.
 */
export async function sendMetaCapiEvent(payload: MetaCapiEventPayload): Promise<MetaCapiResult> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  const apiVersion = process.env.META_GRAPH_API_VERSION || 'v21.0';
  const testEventCode = process.env.META_CAPI_TEST_EVENT_CODE;

  // Validate required credentials safely without leaking values
  if (!pixelId || !accessToken) {
    return {
      success: false,
      skipped: true,
      error: 'Meta CAPI credentials (META_PIXEL_ID or META_CAPI_ACCESS_TOKEN) are not configured in environment.',
    };
  }

  try {
    const rawUserData = payload.user_data || {};

    // Build normalised, hashed user_data according to Meta CAPI specification
    const userData: Record<string, any> = {};

    const hashedEmail = hashSha256(rawUserData.email);
    if (hashedEmail) userData.em = [hashedEmail];

    const hashedPhone = hashPhone(rawUserData.phone);
    if (hashedPhone) userData.ph = [hashedPhone];

    const hashedFn = hashSha256(rawUserData.firstName);
    if (hashedFn) userData.fn = [hashedFn];

    const hashedLn = hashSha256(rawUserData.lastName);
    if (hashedLn) userData.ln = [hashedLn];

    // Client IP and User Agent must NOT be hashed
    if (rawUserData.clientIpAddress) {
      userData.client_ip_address = rawUserData.clientIpAddress;
    }
    if (rawUserData.clientUserAgent) {
      userData.client_user_agent = rawUserData.clientUserAgent;
    }

    // fbp and fbc cookies must NOT be hashed
    if (rawUserData.fbp) {
      userData.fbp = rawUserData.fbp;
    }
    if (rawUserData.fbc) {
      userData.fbc = rawUserData.fbc;
    }

    const eventPayload: Record<string, any> = {
      event_name: payload.event_name,
      event_time: payload.event_time || Math.floor(Date.now() / 1000),
      event_id: payload.event_id,
      event_source_url: payload.event_source_url || 'https://vedantverse.in/',
      action_source: 'website',
      user_data: userData,
    };

    if (payload.custom_data) {
      eventPayload.custom_data = payload.custom_data;
    }

    const requestBody: Record<string, any> = {
      data: [eventPayload],
    };

    // Include test_event_code only when provided in environment (for Events Manager Test Events)
    if (testEventCode && testEventCode.trim()) {
      requestBody.test_event_code = testEventCode.trim();
    }

    const endpoint = `https://graph.facebook.com/${apiVersion}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    });

    const responseJson = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI dispatch error:', {
        status: response.status,
        message: responseJson.error?.message || 'Unknown CAPI error',
        type: responseJson.error?.type,
        code: responseJson.error?.code,
        fbtrace_id: responseJson.error?.fbtrace_id,
      });

      return {
        success: false,
        error: responseJson.error?.message || `CAPI HTTP ${response.status}`,
        fbtrace_id: responseJson.error?.fbtrace_id,
      };
    }

    return {
      success: true,
      events_received: responseJson.events_received ?? 1,
      fbtrace_id: responseJson.fbtrace_id,
    };
  } catch (err: any) {
    console.error('Meta CAPI network/runtime failure:', err.message);
    return {
      success: false,
      error: err.message || 'CAPI network exception',
    };
  }
}

