import { NextResponse } from 'next/server';
import { validateAdminCredentials, createSessionToken, ADMIN_COOKIE_NAME, getAdminUserByEmail } from '@/lib/adminAuth';
import { recordAuditLog } from '@/lib/auditLog';
import { sendAdminLoginNotification } from '@/lib/notifications';
import {
  getRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  getUserPassword,
  generateOtp,
  dispatchSecurityOtp,
} from '@/lib/securityStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email = 'Owner@vedantverse.in', password, directLogin = false } = body;
    const cleanEmail = email.trim().toLowerCase();

    // Check rate limit status
    const currentRate = getRateLimit(cleanEmail);
    if (currentRate.isBlocked) {
      return NextResponse.json(
        {
          success: false,
          error: 'Account permanently blocked due to repeated security lockouts. Contact Super Administrator to unblock.',
          rateLimit: currentRate,
        },
        { status: 423 }
      );
    }

    if (currentRate.isLocked) {
      return NextResponse.json(
        {
          success: false,
          error: 'Account temporarily locked for 6 hours. Rate limit security policy active.',
          rateLimit: currentRate,
        },
        { status: 429 }
      );
    }

    let authResult = validateAdminCredentials(cleanEmail, password);
    if (!authResult.valid) {
      const dynamicPass = getUserPassword(cleanEmail);
      if (dynamicPass && password === dynamicPass) {
        const user = getAdminUserByEmail(cleanEmail);
        if (user) {
          authResult = { valid: true, user };
        }
      }
    }

    if (!authResult.valid || !authResult.user) {
      const updatedLimit = recordFailedAttempt(cleanEmail);
      let errorMsg = authResult.error || 'Authentication failed.';
      if (updatedLimit.isBlocked) {
        errorMsg = 'Account permanently blocked after 5 failed security chances.';
      } else if (updatedLimit.isLocked) {
        errorMsg = 'Attempts exhausted for this chance. Account locked for 6 hours.';
      } else {
        errorMsg = `Invalid credentials. ${updatedLimit.attemptsRemaining} of ${updatedLimit.maxAttempts} attempts remaining (Chance ${updatedLimit.stage} of 5).`;
      }

      return NextResponse.json(
        { success: false, error: errorMsg, rateLimit: updatedLimit },
        { status: 401 }
      );
    }

    const user = authResult.user;
    const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0].trim();
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor || realIp || '127.0.0.1';
    const city = request.headers.get('x-vercel-ip-city') || '';
    const country = request.headers.get('x-vercel-ip-country') || '';
    const location = [city, country].filter(Boolean).join(', ') || 'Local / Network';
    const userAgent = request.headers.get('user-agent') || 'Browser';

    // 2-FACTOR AUTHENTICATION REQUIREMENT:
    // If not directLogin, password verification automatically triggers real OTP dispatch
    // to contactvedantverse@gmail.com and Telegram @Vedantversebot for Step 2 confirmation!
    if (!directLogin) {
      const otp = generateOtp(cleanEmail);
      const dispatchResult = await dispatchSecurityOtp({
        email: cleanEmail,
        otp,
        ip,
        userAgent,
        location,
      });

      const maskedEmail = 'contactvedantverse@gmail.com'.replace(/(^.{2})(.*)(@.*$)/, '$1••••••$3');

      return NextResponse.json({
        success: true,
        requireOtp: true,
        email: cleanEmail,
        targetEmail: 'contactvedantverse@gmail.com',
        maskedEmail,
        message: 'Password verified! 4-digit security code sent to contactvedantverse@gmail.com & Telegram.',
        rateLimit: getRateLimit(cleanEmail),
        emailSent: dispatchResult.emailSent,
        telegramSent: dispatchResult.telegramSent,
      });
    }

    // Direct Login (when OTP was already verified or directLogin is explicitly requested)
    resetRateLimit(cleanEmail);

    const rememberMe = body.rememberMe !== false; // Default true: 15 days
    const durationDays = rememberMe ? 15 : 1;
    const sessionToken = await createSessionToken(user, durationDays);

    // Record Audit Log
    try {
      recordAuditLog({
        action: 'User Session Password Login',
        category: 'access',
        targetType: 'auth',
        targetTitle: 'Admin Command Centre',
        user: user.name,
        userEmail: user.email,
        userRole: user.role,
        details: `Successful password login as ${user.role} (${user.email}) from ${ip} (${location}). Rate limits auto-reset to Chance 1.`,
      });
    } catch (e) {
      console.error('Audit logging error:', e);
    }

    // Dispatch instant alert notification
    sendAdminLoginNotification({
      user,
      ip,
      userAgent,
      location,
    }).catch((err) => console.error('Login alert dispatch error:', err));

    const response = NextResponse.json({
      success: true,
      user,
      message: `Welcome back, ${user.name}!`,
      rateLimit: getRateLimit(cleanEmail),
    });

    // Set secure HTTP-only cookie (15 days if rememberMe, otherwise browser session)
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
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Server authentication error.' },
      { status: 500 }
    );
  }
}
