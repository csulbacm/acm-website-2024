import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { absoluteUrl } from '../../../lib/seo';
import { buildEventOgImage } from '../../../lib/cloudinaryOg';

export default async function Head({ params }) {
  const { slug } = params;
  const client = await clientPromise;
  const db = client.db('acmData');
  let query = { slug };
  try { query = { $or: [{ slug }, { _id: new ObjectId(slug) }] }; } catch {}
  const evt = await db.collection('events').findOne(query);
  if (!evt) {
    return <title>Event | ACM at CSULB</title>;
  }
  const canonical = absoluteUrl(`/events/${encodeURIComponent(evt.slug || String(evt._id))}`);
  const title = `${evt.title} | ACM at CSULB`;
  const description = (evt.description || '').replace(/<[^>]+>/g, ' ').trim().slice(0, 160);
  const readableDate = evt.startDate ? new Date(evt.startDate).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', month:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit' }) : '';
  const locationText = evt.eventLocation || evt.location || 'CSULB';
  const ogRoute = absoluteUrl(`/events/${encodeURIComponent(evt.slug || String(evt._id))}/opengraph-image`);
  const twRoute = absoluteUrl(`/events/${encodeURIComponent(evt.slug || String(evt._id))}/twitter-image`);
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="event" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
  <meta property="og:image" content={ogRoute} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={evt.title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={twRoute} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context':'https://schema.org','@type':'BreadcrumbList',
        itemListElement:[
          { '@type':'ListItem', position:1, name:'Events', item: absoluteUrl('/events') },
          { '@type':'ListItem', position:2, name: evt.title, item: canonical }
        ]
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Event',
        name: evt.title,
        description,
        startDate: evt.startDate && new Date(evt.startDate).toISOString(),
        endDate: evt.endDate && new Date(evt.endDate).toISOString(),
        eventStatus: 'https://schema.org/' + (new Date(evt.endDate || evt.startDate) < new Date() ? 'EventCompleted' : 'EventScheduled'),
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  image: ogRoute,
        location: (evt.eventLocation || evt.location) ? { '@type': 'Place', name: evt.eventLocation || evt.location } : undefined,
        organizer: { '@type': 'Organization', name: 'ACM at CSULB', url: absoluteUrl('/') },
      }) }} />
    </>
  );
}
