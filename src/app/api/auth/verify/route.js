import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(req) {
  const token = req.cookies.get('token'); // Get the token object

  // Check if the token exists and retrieve its value
  if (!token || typeof token.value !== 'string') {
    console.error("Token is missing or not a string:", token);
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    jwt.verify(token.value, SECRET_KEY); // Use token.value for verification
    return NextResponse.json({ message: 'Authenticated' });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
