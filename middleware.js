import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export function middleware(req) {
  // Log the Authorization header and the extracted token
  const authHeader = req.headers.get('Authorization');
  
  const token = req.cookies.get('token') || authHeader?.split(' ')[1];

  if (!token) {
    // Redirect to login if no token is present
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    jwt.verify(token, SECRET_KEY);
    return NextResponse.next(); // Allow access if token is valid
  } catch (error) {
    // Redirect to login if token is invalid
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Protect /admin, /register, and /api/events routes
export const config = {
  matcher: ['/admin/:path*', '/register', '/api/events/:path*'],
};
