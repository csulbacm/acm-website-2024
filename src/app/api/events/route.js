import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { sendBrevoEmail } from '../../../../lib/brevo';

const SECRET_KEY = process.env.JWT_SECRET;
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('acmData');
    const events = await db.collection('events').find({}).toArray();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error retrieving events:', error);
    return NextResponse.json({ error: 'Error retrieving events' }, { status: 500 });
  }
}

export async function POST(req) {
  // Authentication
  const authHeader = req.headers.get('authorization') || '';
  const tokenFromHeader = authHeader.replace('Bearer ', '').trim();
  const tokenFromCookie = req.cookies.get('token')?.value;
  const token = tokenFromHeader || tokenFromCookie;
  if (!token) {
    console.error('No token provided');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    jwt.verify(token, SECRET_KEY);

    // Parse new event
    const event = await req.json();

    // Insert event
    const client = await clientPromise;
    const db = client.db('acmData');
    const result = await db.collection('events').insertOne(event);

    // Fetch subscribers
    const subs = await db.collection('subscribers').find({}).toArray();
    const recipients = subs.map(s => ({ email: s.email }));

    // Prepare email content
    const subject = `New Event: ${event.title}`;
    const baseUrl = 'https://csulb.acm.org';
    const logoUrl = `${baseUrl}/images/acm-csulb.png`;
    let eventImage = null;
      if (event.image) {
        if (event.image.startsWith("data:") || event.image.startsWith("http")) {
          // already a data URI or full URL
          eventImage = event.image;
        } else {
          // a relative path on your site
          eventImage = `${baseUrl}${event.image}`; 
        }
      }
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
        <div style="text-align:center; margin-bottom:20px;">
          <img src="${logoUrl}" alt="ACM CSULB Logo" width="100" />
        </div>
        <h2 style="color:#00437b;">New Event Posted</h2>
        <h3>${event.title}</h3>
        ${ eventImage ? `<div style="text-align:center;margin:20px 0;"><img src="${eventImage}" alt="${event.title}" style="max-width:100%; border-radius:8px;" /></div>` : '' }
        <p>${event.description}</p>
        <p><strong>Date:</strong> ${new Date(event.startDate).toLocaleString()}</p>
        <p><strong>Location:</strong> ${event.eventLocation || 'CSULB'}</p>
        <div style="text-align:center; margin-top:30px;">
          <a href="https://csulb.acm.org/events" style="background-color:#00437b;color:#ffffff;padding:12px 24px;border-radius:4px;text-decoration:none;">View All Events</a>
        </div>
      </div>
    `;

    // Send notification email
    if (recipients.length) {
      await sendBrevoEmail({ to: recipients, subject, htmlContent });
    }

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.error('Error adding event or sending emails:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(req) {
  // Authentication
  const authHeader = req.headers.get('authorization') || '';
  const tokenFromHeader = authHeader.replace('Bearer ', '').trim();
  const tokenFromCookie = req.cookies.get('token')?.value;
  const token = tokenFromHeader || tokenFromCookie;
  if (!token) {
    console.error('No token provided');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    jwt.verify(token, SECRET_KEY);
    const { ids } = await req.json();
    const client = await clientPromise;
    const db = client.db('acmData');
    await db.collection('events').deleteMany({
      _id: { $in: ids.map(id => new ObjectId(id)) }
    });
    return NextResponse.json({ message: 'Events deleted successfully' });
  } catch (error) {
    console.error('Error deleting events or token verification failed:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}