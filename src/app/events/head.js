import clientPromise from '../../../lib/mongodb';
import { absoluteUrl } from '../../lib/seo';

export default async function Head() {
  const url = absoluteUrl('/events');
  const title = 'Events | ACM at CSULB';
  const description = 'Explore upcoming ACM at CSULB events including workshops, hackathons, and networking opportunities.';
  const image = absoluteUrl('/images/acm-csulb.png');

  // Build JSON-LD ItemList of near-future events
  let jsonLd = null;
  try {
    const client = await clientPromise;
    const db = client.db('acmData');
    const now = new Date();
    const events = await db
      .collection('events')
      .find({ startDate: { $gte: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 90) } }) // last 90d and future
      .sort({ startDate: 1 })
      .limit(50)
      .toArray();

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'ACM at CSULB Events',
      itemListElement: events.map((e, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Event',
          name: e.title,
          description: e.description,
          startDate: e.startDate && new Date(e.startDate).toISOString(),
          endDate: e.endDate && new Date(e.endDate).toISOString(),
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          eventStatus: 'https://schema.org/EventScheduled',
          image: e.image ? (e.image.startsWith('http') ? e.image : `${url.replace(/\/$/,'')}${e.image.startsWith('/')? '': '/'}${e.image}`) : image,
          location: e.eventLocation || e.location
            ? {
                '@type': 'Place',
                name: e.eventLocation || e.location,
                address: e.eventLocation || e.location,
              }
            : undefined,
          organizer: {
            '@type': 'Organization',
            name: 'ACM at CSULB',
            url,
          },
        },
      })),
    };
  } catch (e) {
    // ignore if db not available at build time
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="ACM at CSULB" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </>
  );
}
