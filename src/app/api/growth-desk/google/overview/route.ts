import { NextRequest, NextResponse } from 'next/server';
import { isGoogleAnalyticsAuthorized } from '@/lib/googleRouteAuth';
import {
  listGscSites,
  listGa4Properties,
  getGscPerformance,
  getGa4Performance,
} from '@/lib/googleAnalyticsApi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function dateDaysAgo(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  if (!(await isGoogleAnalyticsAuthorized())) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const params = request.nextUrl.searchParams;
  const siteUrl = params.get('siteUrl');
  const propertyId = params.get('propertyId');
  const startDate = params.get('startDate') ?? dateDaysAgo(30);
  const endDate = params.get('endDate') ?? dateDaysAgo(3);

  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);

  if (
    !DATE_PATTERN.test(startDate) ||
    !DATE_PATTERN.test(endDate) ||
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start > end ||
    end > Date.now() ||
    (end - start) / 86_400_000 > 366
  ) {
    return NextResponse.json(
      { error: 'Invalid date range' },
      { status: 400 }
    );
  }

  if (!siteUrl && !propertyId) {
    return NextResponse.json(
      { error: 'Provide siteUrl or propertyId' },
      { status: 400 }
    );
  }

  try {
    const result: Record<string, unknown> = {
      source: 'google',
      startDate,
      endDate,
    };

    if (siteUrl) {
      const sites = await listGscSites();
      if (!sites.some((site) => site.siteUrl === siteUrl)) {
        return NextResponse.json(
          { error: 'GSC site not accessible' },
          { status: 403 }
        );
      }
      result.gsc = await getGscPerformance(
        siteUrl,
        startDate,
        endDate
      );
    }

    if (propertyId) {
      const properties = await listGa4Properties();
      if (!properties.some((p) => p.id === propertyId)) {
        return NextResponse.json(
          { error: 'GA4 property not accessible' },
          { status: 403 }
        );
      }
      result.ga4 = await getGa4Performance(
        propertyId,
        startDate,
        endDate
      );
    }

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Google analytics overview failed', error);
    return NextResponse.json(
      { error: 'GOOGLE_ANALYTICS_FETCH_FAILED' },
      { status: 502 }
    );
  }
}
