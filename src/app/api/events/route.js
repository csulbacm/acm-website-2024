import clientPromise from '../../../../lib/mongodb'; // Adjust path as needed
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('acmData'); // Replace 'acmData' with your actual database name

    // Access the 'events' collection and retrieve all events
    const eventsCollection = db.collection('events');
    const events = await eventsCollection.find({}).toArray();

    // Return the events in JSON format
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error retrieving events:', error);
    return NextResponse.json(
      { error: 'Error retrieving events' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  // Get the token from the authorization header or cookies
  const authHeader = req.headers.get('authorization') || '';
  const tokenFromHeader = authHeader.replace('Bearer ', '').trim();
  const tokenCookie = req.cookies.get('token');
  const tokenFromCookie = tokenCookie?.value;

  // Choose the token from header or cookie
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    console.error('No token provided');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the token
    jwt.verify(token, SECRET_KEY);

    // If verification passes, proceed to add the event
    const client = await clientPromise;
    const db = client.db('acmData');
    const event = await req.json();

    const result = await db.collection('events').insertOne(event);
    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.error(
      'Error adding event or token verification failed:',
      error
    );
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(req) {
  // Get the token from the authorization header or cookies
  const authHeader = req.headers.get('authorization') || '';
  const tokenFromHeader = authHeader.replace('Bearer ', '').trim();
  const tokenCookie = req.cookies.get('token');
  const tokenFromCookie = tokenCookie?.value;

  // Choose the token from header or cookie
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    console.error('No token provided');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the token
    jwt.verify(token, SECRET_KEY);

    // If verification passes, proceed to delete events
    const { ids } = await req.json();
    const client = await clientPromise;
    const db = client.db('acmData');

    await db.collection('events').deleteMany({
      _id: { $in: ids.map((id) => new ObjectId(id)) },
    });

    return NextResponse.json({ message: 'Events deleted successfully' });
  } catch (error) {
    console.error(
      'Error deleting events or token verification failed:',
      error
    );
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
