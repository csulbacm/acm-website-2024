import clientPromise from '../../lib/mongodb';

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://csulb-acm.org';
  const staticPaths = ['', 'about', 'events', 'blog', 'contact', 'sponsors'];
  const urls = staticPaths.map((p) => ({
    url: p ? `${base}/${p}` : base,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // dynamic: blogs and any event detail pages if present elsewhere
  try {
    const client = await clientPromise;
    const db = client.db('acmData');
    const blogs = await db.collection('blogs').find({}, { projection: { slug: 1, updatedAt: 1, createdAt: 1 } }).toArray();
    for (const b of blogs) {
      const lastMod = b.updatedAt || b.createdAt || new Date();
      urls.push({ url: `${base}/blog/${encodeURIComponent(b.slug || String(b._id))}`, lastModified: lastMod, changeFrequency: 'monthly', priority: 0.8 });
    }
    const events = await db.collection('events').find({}, { projection: { _id: 1, updatedAt: 1, startDate: 1 } }).toArray();
    for (const e of events) {
      // We currently don’t have a dedicated event detail page route; include events listing only for now
      // If detail pages are added later (e.g., /events/[id]), emit entries here:
      // urls.push({ url: `${base}/events/${e._id}`, lastModified: e.updatedAt || e.startDate, changeFrequency: 'weekly', priority: 0.6 });
    }
  } catch (e) {
    // ignore db errors to not fail sitemap
    console.error('sitemap db error:', e);
  }

  return urls;
}
