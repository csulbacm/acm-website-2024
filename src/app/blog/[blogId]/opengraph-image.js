import { ImageResponse } from 'next/og';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';
export const alt = 'ACM at CSULB Blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { blogId } = params;
  const client = await clientPromise;
  const db = client.db('acmData');
  let query = { slug: blogId };
  try { query = { $or: [{ slug: blogId }, { _id: new ObjectId(blogId) }] }; } catch {}
  const blog = await db.collection('blogs').findOne(query);

  const title = (blog?.title || 'ACM Blog').slice(0, 100);
  const author = blog?.author || 'ACM at CSULB';
  const bg = blog?.image && blog.image.startsWith('http') ? blog.image : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          background: bg
            ? `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${bg}) center/cover`
            : 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 28, opacity: 0.9 }}>by {author}</div>
          <div style={{ marginLeft: 'auto', fontWeight: 700 }}>ACM @ CSULB</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
