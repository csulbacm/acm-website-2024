import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || req.url.split('/').pop();
    if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('acmData');
    const blog = await db.collection('blogs').findOne({ slug });
    if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
