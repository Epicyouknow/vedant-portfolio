import 'server-only';
import { getGoogleAccessToken } from '@/lib/googleAccessToken';

type GscSite = {
  siteUrl: string;
  permissionLevel?: string;
};

type GscRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

type Ga4Row = {
  dimensionValues?: { value: string }[];
  metricValues?: { value: string }[];
};

async function googleRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getGoogleAccessToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    console.error('Google API request failed', {
      status: response.status,
      endpoint: new URL(url).pathname,
      response: body.slice(0, 300),
    });
    throw new Error(`GOOGLE_API_ERROR_${response.status}`);
  }

  return (await response.json()) as T;
}

export async function listGscSites() {
  const result = await googleRequest<{
    siteEntry?: GscSite[];
  }>('https://www.googleapis.com/webmasters/v3/sites');

  return result.siteEntry ?? [];
}

export async function listGa4Properties() {
  type AccountSummary = {
    displayName?: string;
    propertySummaries?: {
      property: string;
      displayName?: string;
    }[];
  };

  const properties: {
    id: string;
    name: string;
    account: string;
  }[] = [];

  let pageToken: string | undefined;

  do {
    const url = new URL(
      'https://analyticsadmin.googleapis.com/v1beta/accountSummaries'
    );
    url.searchParams.set('pageSize', '200');
    if (pageToken) {
      url.searchParams.set('pageToken', pageToken);
    }

    const result = await googleRequest<{
      accountSummaries?: AccountSummary[];
      nextPageToken?: string;
    }>(url.toString());

    for (const account of result.accountSummaries ?? []) {
      for (const property of account.propertySummaries ?? []) {
        properties.push({
          id: property.property.replace('properties/', ''),
          name: property.displayName ?? property.property,
          account: account.displayName ?? '',
        });
      }
    }

    pageToken = result.nextPageToken;
  } while (pageToken);

  return properties;
}

export async function getGscPerformance(
  siteUrl: string,
  startDate: string,
  endDate: string
) {
  const endpoint =
    'https://www.googleapis.com/webmasters/v3/sites/' +
    encodeURIComponent(siteUrl) +
    '/searchAnalytics/query';

  const summary = await googleRequest<{
    rows?: GscRow[];
  }>(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      startDate,
      endDate,
      type: 'web',
      dataState: 'final',
    }),
  });

  const queries = await googleRequest<{
    rows?: GscRow[];
  }>(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      startDate,
      endDate,
      type: 'web',
      dimensions: ['query'],
      rowLimit: 10,
      dataState: 'final',
    }),
  });

  const total = summary.rows?.[0];

  return {
    clicks: total?.clicks ?? 0,
    impressions: total?.impressions ?? 0,
    ctr: total?.ctr ?? 0,
    averagePosition: total?.position ?? 0,
    topQueries: (queries.rows ?? []).map((row) => ({
      query: row.keys?.[0] ?? '',
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    })),
  };
}

export async function getGa4Performance(
  propertyId: string,
  startDate: string,
  endDate: string
) {
  if (!/^\d+$/.test(propertyId)) {
    throw new Error('INVALID_GA4_PROPERTY_ID');
  }

  const endpoint =
    `https://analyticsdata.googleapis.com/v1beta/properties/` +
    `${propertyId}:runReport`;

  const report = await googleRequest<{
    rows?: Ga4Row[];
  }>(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'engagementRate' },
        { name: 'averageSessionDuration' },
      ],
    }),
  });

  const values = report.rows?.[0]?.metricValues ?? [];
  const numberAt = (index: number) =>
    Number(values[index]?.value ?? 0);

  return {
    activeUsers: numberAt(0),
    newUsers: numberAt(1),
    sessions: numberAt(2),
    pageViews: numberAt(3),
    engagementRate: numberAt(4),
    averageSessionDuration: numberAt(5),
  };
}
