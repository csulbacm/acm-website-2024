import { ImageResponse } from 'next/og';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';
export const alt = 'ACM at CSULB Event';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { slug } = params;
  const client = await clientPromise;
  const db = client.db('acmData');
  let query = { slug };
  try { query = { $or: [{ slug }, { _id: new ObjectId(slug) }] }; } catch {}
  const evt = await db.collection('events').findOne(query);

  const title = (evt?.title || 'ACM Event').slice(0, 100);
  const dateStr = evt?.startDate ? new Date(evt.startDate).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';
  const loc = evt?.eventLocation || evt?.location || 'CSULB';
  const bg = evt?.image && evt.image.startsWith('http') ? evt.image : undefined;

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
            ? `linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.75)), url(${bg}) center/cover`
            : 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        }}
      >
        <div>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
          <div style={{ marginTop: 12, fontSize: 32, opacity: 0.95 }}>{dateStr}</div>
          <div style={{ marginTop: 8, fontSize: 28, opacity: 0.9 }}>{loc}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginLeft: 'auto', fontWeight: 700 }}>ACM @ CSULB</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
