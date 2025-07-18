import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // Prevent access to login/signup when already logged in
  if (isLoggedIn && (pathname === '/login' || pathname === '/signup')) {
    const url = req.nextUrl.clone();
    url.pathname = '/'; // or '/editor' or '/dashboard'
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup'],
};
