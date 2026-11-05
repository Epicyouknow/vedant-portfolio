import { NextResponse } from 'next/server';
import { validateAdminCredentials, createSessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { recordAuditLog } from '@/lib/auditLog';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const authResult = validateAdminCredentials(email, password);

    if (!authResult.valid || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Authentication failed.' },
        { status: 401 }
      );
    }

    const user = authResult.user;
    const sessionToken = await createSessionToken(user, 30); // 30-day session

    // Record Audit Log
    try {
      recordAuditLog({
        action: 'User Session Login',
        category: 'access',
        targetType: 'auth',
        targetTitle: 'Admin Command Centre',
        user: user.name,
        userEmail: user.email,
        userRole: user.role,
        details: `Successful authenticated login as ${user.role} (${user.email}).`,
      });
    } catch (e) {
      console.error('Audit logging error:', e);
    }

    const response = NextResponse.json({
      success: true,
      user,
      message: `Welcome back, ${user.name}!`,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
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
