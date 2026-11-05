import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/adminAuth';
import { recordAuditLog } from '@/lib/auditLog';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const currentToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (currentToken) {
      const { user } = await verifySessionToken(currentToken);
      if (user) {
        try {
          recordAuditLog({
            action: 'User Session Logout',
            category: 'access',
            targetType: 'auth',
            targetTitle: 'Admin Command Centre',
            user: user.name,
            userEmail: user.email,
            userRole: user.role,
            details: `Logged out from CMS session.`,
          });
        } catch (e) {
          console.error(e);
        }
      }
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });

    // Expire cookie immediately
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false, error: 'Server error during logout.' }, { status: 500 });
  }
}

