import { NextResponse } from 'next/server';
import { verifyOtp, getRateLimit } from '@/lib/securityStore';
import { getAdminUserByEmail, createSessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { recordAuditLog } from '@/lib/auditLog';
import { sendAdminLoginNotification } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = body.email || 'contactvedantverse@gmail.com';
    const email = rawEmail.trim().toLowerCase();
    const code = (body.otp || body.code || '').trim();
    const rememberMe = body.rememberMe !== false; // Default true: 15 days

    if (!code) {
      return NextResponse.json({
        success: false,
        error: 'Please enter the 4-digit verification code.',
      }, { status: 400 });
    }

    const verification = verifyOtp(email, code);

    if (!verification.success) {
      const updatedLimit = getRateLimit(email);
      return NextResponse.json({
        success: false,
        error: verification.error || 'Invalid 4-digit code.',
        rateLimit: updatedLimit,
      }, { status: 401 });
    }

    // Code is valid! Get admin user
    const user = getAdminUserByEmail(email) || {
      id: 'user-owner-gmail',
      name: 'Vedant Tiwari',
      email: 'contactvedantverse@gmail.com',
      role: 'Owner',
      title: 'Founder & Performance Director',
      status: 'Active',
      lastActive: 'Just now',
    };

    const durationDays = rememberMe ? 15 : 1;
    const sessionToken = await createSessionToken(user, durationDays);

    // Request metadata
    const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0].trim();
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor || realIp || '127.0.0.1';
    const city = request.headers.get('x-vercel-ip-city') || '';
    const country = request.headers.get('x-vercel-ip-country') || '';
    const location = [city, country].filter(Boolean).join(', ') || 'Local / Network';
    const userAgent = request.headers.get('user-agent') || 'Browser';

    // Record Audit Log
    try {
      recordAuditLog({
        action: 'Verified 4-Digit OTP Login',
        category: 'access',
        targetType: 'auth',
        targetTitle: 'Admin Command Centre',
        user: user.name,
        userEmail: user.email,
        userRole: user.role,
        details: `Successful 4-digit OTP login as ${user.role} (${user.email}) from ${ip} (${location}). Session duration: ${rememberMe ? '15 Days' : 'Session'}.`,
      });
    } catch (e) {
      console.error('Audit logging error:', e);
    }

    // Dispatch login alert notification
    sendAdminLoginNotification({
      user,
      ip,
      userAgent,
      location,
    }).catch((err) => console.error('Login alert dispatch error:', err));

    const response = NextResponse.json({
      success: true,
      user,
      message: `Welcome back, ${user.name}! Authentication verified for ${rememberMe ? '15 days' : 'this session'}.`,
    });

    // Set secure HTTP-only session cookie (15 days if rememberMe, otherwise browser session)
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      ...(rememberMe ? { maxAge: 15 * 24 * 60 * 60 } : {}),
    });

    return response;
  } catch (error: any) {
    console.error('OTP verify error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server verification error. Please try again.',
    }, { status: 500 });
  }
}
