import { NextResponse } from 'next/server';
import { isGoogleAnalyticsAuthorized } from '@/lib/googleRouteAuth';
import { hasGoogleRefreshToken } from '@/lib/googleTokenStore';
import {
  listGscSites,
  listGa4Properties,
} from '@/lib/googleAnalyticsApi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isGoogleAnalyticsAuthorized())) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const connected = await hasGoogleRefreshToken();

    if (!connected) {
      return NextResponse.json(
        {
          connected: false,
          gsc: { sites: [] },
          ga4: { properties: [] },
        },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const [gsc, ga4] = await Promise.allSettled([
      listGscSites(),
      listGa4Properties(),
    ]);

    return NextResponse.json(
      {
        connected: true,
        gsc:
          gsc.status === 'fulfilled'
            ? { sites: gsc.value }
            : { sites: [], error: 'GSC_DISCOVERY_FAILED' },
        ga4:
          ga4.status === 'fulfilled'
            ? { properties: ga4.value }
            : { properties: [], error: 'GA4_DISCOVERY_FAILED' },
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json(
      { error: 'GOOGLE_STATUS_FAILED' },
      { status: 500 }
    );
  }
}
