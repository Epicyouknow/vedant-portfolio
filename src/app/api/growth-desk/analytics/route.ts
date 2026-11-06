import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const analyticsData = {
      overview: {
        organicClicks: 2840,
        clicksTrend: '+18.4%',
        impressions: 63420,
        impressionsTrend: '+27.1%',
        avgPosition: 12.6,
        positionTrend: '-2.8',
        organicSessions: 3920,
        sessionsTrend: '+19.7%'
      },
      trafficTrend: [
        { date: 'Jan 1', clicks: 65, impressions: 1420 },
        { date: 'Jan 5', clicks: 78, impressions: 1680 },
        { date: 'Jan 9', clicks: 84, impressions: 1890 },
        { date: 'Jan 13', clicks: 98, impressions: 2150 },
        { date: 'Jan 17', clicks: 112, impressions: 2480 },
        { date: 'Jan 21', clicks: 125, impressions: 2820 },
        { date: 'Jan 25', clicks: 140, impressions: 3100 },
        { date: 'Jan 30', clicks: 156, impressions: 3450 }
      ],
      topArticles: [
        {
          title: 'GA4 + GTM Setup Guide for Performance Marketers',
          slug: 'ga4-gtm-tracking-guide',
          clicks: 1240,
          impressions: 24500,
          ctr: '5.1%',
          position: 4.2
        },
        {
          title: 'Meta Ads Attribution in 2025: What Changed and How to Adapt',
          slug: 'meta-ads-attribution-2025',
          clicks: 890,
          impressions: 18200,
          ctr: '4.9%',
          position: 6.8
        },
        {
          title: 'Performance Max for E-commerce: Strategy, Setup and Optimization',
          slug: 'performance-max-ecommerce-strategy',
          clicks: 720,
          impressions: 14600,
          ctr: '4.9%',
          position: 7.1
        },
        {
          title: 'Solving Meta Pixel Attribution Loss Post-iOS14 with Shopify CAPI',
          slug: 'd2c-shopify-capi-meta-pixel-tracking',
          clicks: 540,
          impressions: 9800,
          ctr: '5.5%',
          position: 3.8
        }
      ],
      decayAlerts: [
        {
          title: 'Google Ads Account Suspension & Verification Guide',
          slug: 'google-ads-account-suspension-advertiser-verification-guide',
          change: '-14% Clicks (last 14 days)',
          issue: 'Outdated policy references regarding EU DSA verification rules.',
          recommendedAction: 'Queue an assignment to update verification workflows.'
        },
        {
          title: 'B2B Logistics CPL Reduction with High-Intent Search',
          slug: 'b2b-logistics-cpl-reduction-search-intent',
          change: '-8% Impressions',
          issue: 'Competitor surge on exact query "bulk courier rate calculator".',
          recommendedAction: 'Add dedicated section on rate negotiation frameworks.'
        }
      ]
    };

    return NextResponse.json({ success: true, ...analyticsData });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

