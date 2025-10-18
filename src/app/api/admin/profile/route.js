import { NextResponse } from 'next/server';
import { getAdminByEmail, updateAdminProfile } from '../../../../../lib/admin';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;
export const dynamic = 'force-dynamic';

export async function GET() {
  const tokenCookie = cookies().get('token');
  const token = tokenCookie?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const email = decoded?.email;

    if (!email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

  const adminProfile = await getAdminByEmail(email);

    if (!adminProfile) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

  // Exclude sensitive fields like password
  const { password, ...safeProfile } = adminProfile;
  return NextResponse.json(safeProfile, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req) {
  const tokenCookie = cookies().get('token');
  const token = tokenCookie?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const email = decoded.email;

    const { name, title, linkedin, github, website, image } = await req.json();

    if (email && (name || title || linkedin || github || website || image)) {
      const updatedAdmin = await updateAdminProfile(email, {
        name,
        title,
        linkedin,
        github,
        website,
        image,
      });

      if (!updatedAdmin) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Profile updated successfully'}, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
