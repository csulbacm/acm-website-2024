import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export function middleware(req) {
  const authHeader = req.headers.get('Authorization');
  const token = req.cookies.get('token') || authHeader?.split(' ')[1];

  // IP detection logic
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    req.headers.get('x-vercel-forwarded-for') ||
    req.ip ||
    'unknown';

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    jwt.verify(token, SECRET_KEY);

    const response = NextResponse.next();

    // Attach the IP address to headers
    response.headers.set('x-client-ip', clientIp);

    return response;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Protect specific routes
export const config = {
  matcher: ['/admin/:path*', '/register', '/api/events/:path*', '/api/blog/:path*'],
};
