import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/adminAuth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    const { valid, user } = await verifySessionToken(token);

    if (!valid || !user) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error: any) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
