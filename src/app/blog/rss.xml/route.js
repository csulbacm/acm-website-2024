import clientPromise from '../../../../lib/mongodb';
import { absoluteUrl, stripHtml, truncate } from '../../../lib/seo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('acmData');
  const items = await db.collection('blogs').find({}).sort({ createdAt: -1 }).limit(50).toArray();

  const siteUrl = absoluteUrl('/');
  const channel = {
    title: 'ACM at CSULB Blog',
    link: absoluteUrl('/blog'),
    description: 'News, updates, and posts from ACM at CSULB',
    language: 'en-us',
    lastBuildDate: new Date().toUTCString(),
  };

  const xmlItems = items.map((b) => {
    const link = absoluteUrl(`/blog/${encodeURIComponent(b.slug || String(b._id))}`);
    const guid = link;
    const pub = b.createdAt ? new Date(b.createdAt).toUTCString() : new Date().toUTCString();
    const desc = truncate(stripHtml(b.content || b.description || ''), 280);
    return `\n      <item>\n        <title><![CDATA[${b.title}]]></title>\n        <link>${link}</link>\n        <guid isPermaLink="true">${guid}</guid>\n        <pubDate>${pub}</pubDate>\n        <description><![CDATA[${desc}]]></description>\n      </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n  <channel>\n    <title>${channel.title}</title>\n    <link>${channel.link}</link>\n    <description>${channel.description}</description>\n    <language>${channel.language}</language>\n    <lastBuildDate>${channel.lastBuildDate}</lastBuildDate>${xmlItems}\n  </channel>\n</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 's-maxage=600, stale-while-revalidate=86400' },
  });
}
