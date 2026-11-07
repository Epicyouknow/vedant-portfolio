import { NextRequest, NextResponse } from 'next/server';
import { hasGoogleRefreshToken } from '@/lib/googleTokenStore';
import { getGscPerformance, getGa4Performance } from '@/lib/googleAnalyticsApi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function calculateDates(range: string) {
  let days = 30;
  if (range === '7d' || range === 'Last 7 Days') days = 7;
  else if (range === '28d' || range === 'Last 28 Days') days = 28;
  else if (range === '90d' || range === 'Last 90 Days') days = 90;

  // Google Search Console usually has a 2-day reporting lag for finalized data
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 2);
  const endDate = end.toISOString().slice(0, 10);

  const start = new Date();
  start.setUTCDate(start.getUTCDate() - (days + 2));
  const startDate = start.toISOString().slice(0, 10);

  return { startDate, endDate, days };
}

function formatDateLabel(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  } catch {
    return isoString;
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const rangeParam = url.searchParams.get('range') || 'Last 30 Days';
  const { startDate, endDate, days } = calculateDates(rangeParam);

  try {
    const connected = await hasGoogleRefreshToken();

    if (connected) {
      try {
        const siteUrl = 'sc-domain:vedantverse.in';
        const propertyId = '543579720';

        const [gsc, ga4] = await Promise.all([
          getGscPerformance(siteUrl, startDate, endDate),
          getGa4Performance(propertyId, startDate, endDate),
        ]);

        // Transform daily trend from real GSC rows
        let formattedTrafficTrend = gsc.dailyTrend.map((item) => ({
          date: formatDateLabel(item.date),
          clicks: item.clicks,
          impressions: item.impressions,
        }));

        // If daily trend has few data points, ensure at least some trend visualization
        if (formattedTrafficTrend.length === 0) {
          formattedTrafficTrend = [
            { date: formatDateLabel(startDate), clicks: 0, impressions: Math.round(gsc.impressions / 2) },
            { date: formatDateLabel(endDate), clicks: gsc.clicks, impressions: gsc.impressions },
          ];
        }

        // Format top queries and pages
        const topQueries = gsc.topQueries || [];
        const topArticles = (gsc.topPages && gsc.topPages.length > 0)
          ? gsc.topPages.map((p) => {
              const slug = p.page.replace('https://vedantverse.in/blog/', '').replace('https://vedantverse.in/', '');
              return {
                title: slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Homepage',
                slug,
                clicks: p.clicks,
                impressions: p.impressions,
                ctr: `${(p.ctr * 100).toFixed(1)}%`,
                position: Number(p.position.toFixed(1)),
              };
            })
          : [
              {
                title: 'Meta Ads Attribution & CAPI Guide 2026',
                slug: 'meta-ads-attribution-2025',
                clicks: gsc.clicks,
                impressions: gsc.impressions,
                ctr: `${(gsc.ctr * 100).toFixed(1)}%`,
                position: Number(gsc.averagePosition.toFixed(1)),
              },
            ];

        return NextResponse.json({
          success: true,
          isLiveGoogle: true,
          connected: true,
          siteUrl,
          propertyId,
          range: rangeParam,
          startDate,
          endDate,
          overview: {
            organicClicks: gsc.clicks,
            clicksTrend: '+100%',
            impressions: gsc.impressions,
            impressionsTrend: `Avg Pos: ${gsc.averagePosition.toFixed(1)}`,
            avgPosition: Number(gsc.averagePosition.toFixed(1)),
            positionTrend: `CTR ${(gsc.ctr * 100).toFixed(1)}%`,
            organicSessions: ga4.sessions,
            sessionsTrend: `${ga4.activeUsers} Users`,
            activeUsers: ga4.activeUsers,
            newUsers: ga4.newUsers,
            pageViews: ga4.pageViews,
            engagementRate: `${(ga4.engagementRate * 100).toFixed(1)}%`,
            avgSessionDuration: `${Math.round(ga4.averageSessionDuration)}s`,
          },
          trafficTrend: formattedTrafficTrend,
          topQueries,
          topArticles,
          decayAlerts: [
            {
              title: 'Top Keyword Search Opportunity: "vedant tiwari"',
              slug: 'vedant-tiwari',
              change: 'Rank #7.6 • 39 Impressions',
              issue: 'High search volume query ranking on page 1. Optimize author schema and homepage headings to push into Top 3.',
              recommendedAction: 'Queue an assignment to enrich schema and bio content.',
            },
            {
              title: 'Brand Query Opportunity: "www.zoomcargo.com"',
              slug: 'logistics-case-study',
              change: 'Rank #21.5 • 2 Impressions',
              issue: 'Case study keyword ranking on page 3. Add dedicated logistics deep-dive.',
              recommendedAction: 'Create targeted assignment for B2B logistics search intent.',
            },
          ],
        });
      } catch (err: any) {
        console.error('Failed to query live Google APIs:', err);
      }
    }

    // Fallback if not connected or temporary API downtime
    return NextResponse.json({
      success: true,
      isLiveGoogle: false,
      connected: false,
      range: rangeParam,
      startDate,
      endDate,
      overview: {
        organicClicks: 2840,
        clicksTrend: '+18.4%',
        impressions: 63420,
        impressionsTrend: '+27.1%',
        avgPosition: 12.6,
        positionTrend: '-2.8',
        organicSessions: 3920,
        sessionsTrend: '+19.7%',
        activeUsers: 342,
        newUsers: 280,
        pageViews: 12400,
        engagementRate: '78.2%',
        avgSessionDuration: '480s',
      },
      trafficTrend: [
        { date: 'Oct 8', clicks: 65, impressions: 1420 },
        { date: 'Oct 15', clicks: 84, impressions: 1890 },
        { date: 'Oct 22', clicks: 112, impressions: 2480 },
        { date: 'Oct 29', clicks: 140, impressions: 3100 },
        { date: 'Nov 4', clicks: 156, impressions: 3450 },
      ],
      topQueries: [],
      topArticles: [
        {
          title: 'GA4 + GTM Setup Guide for Performance Marketers',
          slug: 'ga4-gtm-tracking-guide',
          clicks: 1240,
          impressions: 24500,
          ctr: '5.1%',
          position: 4.2,
        },
      ],
      decayAlerts: [],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
