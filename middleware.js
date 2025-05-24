import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = await getToken({ req: request });
  
  // Check if user is trying to access admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If no token or not an admin, redirect to home
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // If admin, allow access to admin routes
    return NextResponse.next();
  }

  // Allow normal users and admins to access non-admin routes
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/admin/:path*']
}