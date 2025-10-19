import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export function middleware(req) {
  const url = req.nextUrl.clone();

  // Canonical host redirect (skip for localhost and Vercel previews)
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://acm-csulb.org';
  try {
    const canonical = new URL(base);
    const canonicalHost = canonical.host.toLowerCase();
    const currentHost = url.host.toLowerCase();
    const isLocal = currentHost.startsWith('localhost') || currentHost.startsWith('127.0.0.1');
    const isPreview = currentHost.endsWith('.vercel.app');
    if (!isLocal && !isPreview && canonicalHost && currentHost !== canonicalHost) {
      url.host = canonicalHost;
      return NextResponse.redirect(url, 308);
    }
  } catch {}

  // Auth guard only for protected routes
  const pathname = url.pathname || '';
  const protectedPaths = ['/admin', '/register', '/api/events', '/api/blog'];
  const isProtected = protectedPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!isProtected) return NextResponse.next();

  const authHeader = req.headers.get('Authorization');
  const token = req.cookies.get('token') || authHeader?.split(' ')[1];
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  try {
    const t = typeof token === 'string' ? token : token.value;
    jwt.verify(t, SECRET_KEY);
    return NextResponse.next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Protect specific routes
export const config = {
  matcher: ['/:path*'],
};
