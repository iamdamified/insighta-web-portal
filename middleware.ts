import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if token exists
  const hasToken = request.cookies.has('access_token');

  // Protected routes
  const protectedRoutes = ['/dashboard', '/profiles', '/search', '/account'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !hasToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect to dashboard if already logged in and accessing login
  if (pathname === '/' && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png|.*\\.jpg).*)'],
};
