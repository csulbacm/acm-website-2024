import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getAdminByEmail } from '../../../../../lib/admin';

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const admin = await getAdminByEmail(email);

    if (!admin) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Create JWT with email payload
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

    // Set the token in a secure, HTTP-only cookie
    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
    response.headers.append(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; Secure; Max-Age=3600; SameSite=Strict`
    );

    return response;
  } catch (error) {
    console.error('Error in login route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
