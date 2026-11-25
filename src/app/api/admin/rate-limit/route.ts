import { NextResponse } from 'next/server';
import {
  getRateLimit,
  fastForwardLockout,
  adminUnlock,
  resetRateLimit,
  getMonitoredAccounts,
  RATE_LIMIT_TIERS,
} from '@/lib/securityStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = (searchParams.get('email') || 'contactvedantverse@gmail.com').trim().toLowerCase();

    const rateLimit = getRateLimit(email);
    const monitoredAccounts = getMonitoredAccounts();

    return NextResponse.json({
      success: true,
      email,
      rateLimit,
      tiers: RATE_LIMIT_TIERS,
      monitoredAccounts,
    });
  } catch (error: any) {
    console.error('Rate limit query error:', error);
    return NextResponse.json({ success: false, error: 'Failed to read rate limits.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, email = 'contactvedantverse@gmail.com' } = body;
    const cleanEmail = email.trim().toLowerCase();

    let updated;
    if (action === 'simulate_pass') {
      updated = fastForwardLockout(cleanEmail);
    } else if (action === 'admin_unlock' || action === 'reset') {
      updated = adminUnlock(cleanEmail);
    } else {
      updated = getRateLimit(cleanEmail);
    }

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      rateLimit: updated,
      monitoredAccounts: getMonitoredAccounts(),
    });
  } catch (error: any) {
    console.error('Rate limit action error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update rate limit.' }, { status: 500 });
  }
}
