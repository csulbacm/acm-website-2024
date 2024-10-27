import { NextResponse } from 'next/server';

export async function GET() {
  // Clear the cookie by setting it to expire immediately
  return NextResponse.json({ message: 'Logged out successfully' }, {
    headers: { 'Set-Cookie': `token=; HttpOnly; Path=/; Max-Age=0` }
  });
}
