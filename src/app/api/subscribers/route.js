// pages/api/subscribers/route.js
import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { email, name } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('acmData');
    // avoid duplicates
    await db.collection('subscribers').updateOne(
      { email },
      { $set: { email, name: name || '' } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Subscriber signup error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
