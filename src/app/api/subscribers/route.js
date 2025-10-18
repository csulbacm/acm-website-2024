// pages/api/subscribers/route.js
import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';
import { rateLimit } from '../../../../lib/rateLimit';

const limiter = rateLimit({ windowMs: 60_000, max: 20 });

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const { allowed, remaining, reset } = limiter(`subscribers:${ip}`);
    if (!allowed) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers: { 'Retry-After': String(Math.ceil((reset - Date.now())/1000)) } });
    }
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
