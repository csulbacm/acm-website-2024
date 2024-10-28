import { NextResponse } from 'next/server';
import { getAdminByEmail, updateAdminProfile } from '../../../../../lib/admin'; // Adjust path if necessary
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../../../lib/mongodb';

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET() {
    try {
      const client = await clientPromise;
      const db = client.db('acmData'); // Make sure this matches your database name
  
      // Retrieve all officer profiles from the "admins" collection
      const officers = await db.collection('admins').find({}).toArray();
  
      return new Response(JSON.stringify(officers), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching officers:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

export async function PUT(req) {
  const tokenCookie = cookies().get('token');
  const token = tokenCookie?.value;

  if (!token) {
    console.error('No token provided');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, SECRET_KEY);
    const email = decoded.email;

    // Fetch profile update data from request
    const { name, title, linkedin, github, website, image } = await req.json();

    // Ensure all expected fields are present
    if (email && (name || title || linkedin || github || website || image)) {
      // Update admin profile with new data
      const updatedAdmin = await updateAdminProfile(email, {
        name,
        title,
        linkedin,
        github,
        website,
        image,
      });

      if (!updatedAdmin) {
        console.error('Profile update failed in the database');
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Profile updated successfully', data: updatedAdmin }, { status: 200 });
    } else {
      console.error('Invalid data provided');
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in profile update route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
