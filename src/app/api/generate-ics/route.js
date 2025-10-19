import moment from 'moment-timezone';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title');
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const description = searchParams.get('description') || '';
  const location = searchParams.get('location');

  if (!title || !start || !end || !location) {
    return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Convert to UTC format (assume provided times are America/Los_Angeles unless already Z)
  const tz = 'America/Los_Angeles';
  const startUtc = moment.tz(start, tz).utc().format('YYYYMMDDTHHmmss[Z]');
  const endUtc = moment.tz(end, tz).utc().format('YYYYMMDDTHHmmss[Z]');

  const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ACM CSULB//Website//EN\nCALSCALE:GREGORIAN\nBEGIN:VEVENT\nSUMMARY:${title}\nDESCRIPTION:${description}\nLOCATION:${location}\nDTSTART:${startUtc}\nDTEND:${endUtc}\nEND:VEVENT\nEND:VCALENDAR`;

  const safeName = String(title).replace(/\s+/g, '_').replace(/[^A-Za-z0-9_\-]/g, '').slice(0, 100) || 'event';
  return new Response(icsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar',
      'Content-Disposition': `attachment; filename="${safeName}.ics"`
    }
  });
}
