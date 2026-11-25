import { NextResponse } from 'next/server';
import { generateOtp, getRateLimit, dispatchSecurityOtp } from '@/lib/securityStore';
import { getAdminUserByEmail } from '@/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = body.email || 'contactvedantverse@gmail.com';
    const email = rawEmail.trim().toLowerCase();

    // Check rate limit status
    const rateLimit = getRateLimit(email);
    if (rateLimit.isBlocked) {
      return NextResponse.json({
        success: false,
        error: 'Account permanently blocked due to repeated security lockouts. Contact Super Administrator to unblock.',
        rateLimit,
      }, { status: 423 });
    }

    if (rateLimit.isLocked) {
      return NextResponse.json({
        success: false,
        error: 'Account temporarily locked for 6 hours. Rate limit security policy active.',
        rateLimit,
      }, { status: 429 });
    }

    // Verify authorized user
    const user = getAdminUserByEmail(email);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Email is not recognized as an authorized administrator.',
      }, { status: 403 });
    }

    // Generate real 4-digit numeric OTP
    const otp = generateOtp(email);

    // Extract request details
    const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0].trim();
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor || realIp || '127.0.0.1';
    const city = request.headers.get('x-vercel-ip-city') || '';
    const country = request.headers.get('x-vercel-ip-country') || '';
    const location = [city, country].filter(Boolean).join(', ') || 'Local / Network';
    const userAgent = request.headers.get('user-agent') || 'Browser';

    // Dispatch real email and telegram
    const dispatchResult = await dispatchSecurityOtp({
      email,
      otp,
      ip,
      userAgent,
      location,
    });

    const maskedEmail = 'contactvedantverse@gmail.com'.replace(/(^.{2})(.*)(@.*$)/, '$1••••••$3');

    return NextResponse.json({
      success: true,
      message: '4-digit OTP dispatched to authorized email and Telegram.',
      targetEmail: 'contactvedantverse@gmail.com',
      maskedEmail,
      rateLimit,
      emailSent: dispatchResult.emailSent,
      telegramSent: dispatchResult.telegramSent,
    });
  } catch (error: any) {
    console.error('OTP request error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to dispatch security code. Please try again.',
    }, { status: 500 });
  }
}
