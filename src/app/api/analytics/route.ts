import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { logVisit, logEvent, parseUserAgent, parseReferrer, getAnalyticsStats } from '../../../lib/analyticsDb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, metadata, screenResolution, referrer, path } = body;
    
    const headerList = await headers();
    let ip = headerList.get('x-forwarded-for')?.split(',')[0] || headerList.get('x-real-ip') || '127.0.0.1';
    const ua = headerList.get('user-agent') || '';

    // Clean localhost/private IPs for geo-lookup demo
    if (
      ip === '::1' || 
      ip === '127.0.0.1' || 
      ip.startsWith('fe80') || 
      ip.startsWith('192.168') || 
      ip.startsWith('10.') || 
      ip.startsWith('172.16')
    ) {
      ip = '103.156.126.155'; // Mock Mumbai IP for local testing
    }

    const { device, os, browser } = parseUserAgent(ua);
    const parsedRef = parseReferrer(referrer);

    // Resolve Geolocation via free ipapi.co (non-precise IP geocoding)
    let country = 'Unknown Country';
    let city = 'Unknown City';

    try {
      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, { 
        next: { revalidate: 86400 } // Cache results for 24h
      });
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.country_name) country = geoData.country_name;
        if (geoData.city) city = geoData.city;
      }
    } catch (e) {
      console.warn('Geolocation lookup failed, falling back:', e);
    }

    if (eventName === 'page_view') {
      logVisit({
        ip,
        country,
        city,
        browser,
        os,
        device,
        screenResolution,
        referrer: parsedRef,
        path: path || '/',
      });
    } else {
      logEvent({
        ip,
        eventName,
        metadata,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging analytics record:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const pin = req.nextUrl.searchParams.get('pin') || req.headers.get('x-admin-pin');
    const expectedPin = process.env.ADMIN_PIN || '8520';

    if (pin !== expectedPin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = getAnalyticsStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
