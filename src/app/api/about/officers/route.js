import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('acmData');

    // Retrieve all officer profiles from the "admins" collection
    const officers = await db.collection('admins').find({}).toArray();

    return NextResponse.json(officers, { status: 200 });
  } catch (error) {
    console.error('Error fetching officers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
