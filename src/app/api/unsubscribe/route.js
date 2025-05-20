// app/api/unsubscribe/route.js
import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');
  if (!email) {
    return NextResponse.json(
      { error: 'Missing email parameter' },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db('acmData');

    await db.collection('subscribers').deleteOne({ email });

    return new Response(
      `<h1>You’ve been unsubscribed</h1>
       <p>${email} will no longer receive event emails from ACM CSULB.</p>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
