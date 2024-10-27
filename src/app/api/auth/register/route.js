import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createAdmin, getAdminByEmail } from '../../../../../lib/admin'; // Adjust the import path
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(req) {
  // Get the token from cookies
  const tokenCookie = cookies().get('token');
  const token = tokenCookie?.value;

  if (!token) {
    console.error('No token provided');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    // Proceed with user registration
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await getAdminByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the new user with consistent field naming
    await createAdmin({ email, hashedPassword });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error in registration route:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
