import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export function middleware(req) {
  const authHeader = req.headers.get('Authorization');
  const token = req.cookies.get('token') || authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    jwt.verify(token, SECRET_KEY);
    return NextResponse.next(); // Allow access if token is valid
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Protect specific routes
export const config = {
  matcher: ['/admin/:path*', '/register', '/api/events/:path*', '/api/blog/:path*'],
};
