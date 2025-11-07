import clientPromise from '../../lib/mongodb';

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://acm-csulb.org';

  // ✅ Add "starbound" here
  const staticPaths = ['', 'about', 'events', 'blog', 'contact', 'sponsors', 'starbound'];

  const urls = staticPaths.map((p) => ({
    url: p ? `${base}/${p}` : base,
    changeFrequency: 'weekly',
    priority: p === 'starbound' ? 0.8 : 0.7, // slightly higher for Starbound
  }));

  // dynamic: blogs and any event detail pages if present elsewhere
  try {
    const client = await clientPromise;
    const db = client.db('acmData');

    const blogs = await db
      .collection('blogs')
      .find({}, { projection: { slug: 1, updatedAt: 1, createdAt: 1 } })
      .toArray();

    for (const b of blogs) {
      const lastMod = b.updatedAt || b.createdAt || new Date();
      urls.push({
        url: `${base}/blog/${encodeURIComponent(b.slug || String(b._id))}`,
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    const events = await db
      .collection('events')
      .find({}, { projection: { _id: 1, slug: 1, updatedAt: 1, startDate: 1 } })
      .toArray();

    for (const e of events) {
      const path = `/events/${encodeURIComponent(e.slug || String(e._id))}`;
      urls.push({
        url: `${base}${path}`,
        lastModified: e.updatedAt || e.startDate || new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  } catch (e) {
    console.error('sitemap db error:', e);
  }

  return urls;
}
