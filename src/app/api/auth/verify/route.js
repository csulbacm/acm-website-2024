import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(req) {
  const token = req.cookies.get('token');

  // No token: respond gracefully without 401 noise
  if (!token || typeof token.value !== 'string') {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token.value, SECRET_KEY);
    const safe = { email: decoded?.email, name: decoded?.name, role: decoded?.role };
    return NextResponse.json({ authenticated: true, user: safe });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
