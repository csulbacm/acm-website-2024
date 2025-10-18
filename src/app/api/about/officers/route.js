import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('acmData');

    // Retrieve all officer profiles from the "admins" collection, sorted by custom order
    const officers = await db
      .collection('admins')
      .aggregate([
        { $addFields: { _orderSafe: { $ifNull: ["$order", 999999] } } },
        { $sort: { _orderSafe: 1, name: 1, email: 1 } },
        { $project: { _orderSafe: 0 } },
      ])
      .toArray();

    return NextResponse.json(officers, { status: 200 });
  } catch (error) {
    console.error('Error fetching officers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
