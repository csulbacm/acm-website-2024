import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'; // Import cookies function

const SECRET_KEY = process.env.JWT_SECRET;

export async function PUT(req, { params }) {
  const { id } = params;

  // Get the token from the authorization header or cookies
  const authHeader = req.headers.get('authorization') || '';
  const tokenFromHeader = authHeader.replace('Bearer ', '').trim();
  const tokenCookie = cookies().get('token');
  const tokenFromCookie = tokenCookie?.value;

  // Choose the token from header or cookie
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    console.error('No token provided');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the JWT token
    jwt.verify(token, SECRET_KEY);
    // Proceed if token is valid
    const updatedEvent = await req.json();
    const client = await clientPromise;
    const db = client.db('acmData');
    await db.collection('events').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedEvent }
    );

    return NextResponse.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event or token verification failed:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  // Get the token from the authorization header or cookies
  const authHeader = req.headers.get('authorization') || '';
  const tokenFromHeader = authHeader.replace('Bearer ', '').trim();
  const tokenCookie = cookies().get('token');
  const tokenFromCookie = tokenCookie?.value;

  // Choose the token from header or cookie
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    console.error('No token provided');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the JWT token
    jwt.verify(token, SECRET_KEY);

    // Proceed if token is valid
    const client = await clientPromise;
    const db = client.db('acmData');
    await db.collection('events').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event or token verification failed:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
