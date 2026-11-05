import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE_NAME = 'vedant_admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin and /admin/* routes
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    // If user is accessing the login page:
    if (pathname === '/admin/login') {
      // If user is already authenticated with a valid session cookie, redirect to dashboard
      if (sessionCookie && sessionCookie.includes('.')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // If user is accessing any protected admin route without a session cookie:
    if (!sessionCookie || !sessionCookie.includes('.')) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};

