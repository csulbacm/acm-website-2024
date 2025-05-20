import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { sendBrevoEmail } from '../../../../../lib/brevo';

const SECRET_KEY = process.env.JWT_SECRET;

export async function PUT(req, { params }) {
  const { id } = params;

  // Authentication
  const authHeader = req.headers.get('authorization') || '';
  const tokenFromHeader = authHeader.replace('Bearer ', '').trim();
  const tokenFromCookie = cookies().get('token')?.value;
  const token = tokenFromHeader || tokenFromCookie;
  if (!token) {
    console.error('No token provided');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    jwt.verify(token, SECRET_KEY);

    // Parse updated event data
    const updatedEvent = await req.json();
    const client = await clientPromise;
    const db = client.db('acmData');
    await db.collection('events').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedEvent }
    );

    // Fetch subscribers
    const subs = await db.collection('subscribers').find({}).toArray();
    const recipients = subs.map(s => ({ email: s.email }));

    // Prepare email content
    const subject = `Updated Event: ${updatedEvent.title}`;
    const baseUrl = 'https://acmcsulb.com';
    const logoUrl = `${baseUrl}/images/acm-csulb.png`;
    let eventImage = null;
      if (updatedEvent.image) {
        if (updatedEvent.image.startsWith("data:") || updatedEvent.image.startsWith("http")) {
          // already a data URI or full URL
          eventImage = updatedEvent.image;
        } else {
          // a relative path on your site
          eventImage = `${baseUrl}${updatedEvent.image}`; 
        }
      }
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
        <div style="text-align:center; margin-bottom:20px;">
          <img src="${logoUrl}" alt="ACM CSULB Logo" width="100" />
        </div>
        <h2 style="color:#00437b;">Event Updated</h2>
        <h3>${updatedEvent.title}</h3>
        ${ eventImage ? `<div style="text-align:center;margin:20px 0;"><img src="${eventImage}" alt="${updatedEvent.title}" style="max-width:100%; border-radius:8px;" /></div>` : '' }
        <p>${updatedEvent.description}</p>
        <p><strong>Date:</strong> ${new Date(updatedEvent.startDate).toLocaleString()}</p>
        <div style="text-align:center; margin-top:30px;">
          <a href="https://acmcsulb.com/events" style="background-color:#00437b;color:#ffffff;padding:12px 24px;border-radius:4px;text-decoration:none;">View All Events</a>
        </div>
      </div>
    `;

    // Send update email
    if (recipients.length) {
      await sendBrevoEmail({ to: recipients, subject, htmlContent });
    }

    return NextResponse.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event or sending emails:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  // Authentication
  const authHeader = req.headers.get('authorization') || '';
  const tokenFromHeader = authHeader.replace('Bearer ', '').trim();
  const tokenFromCookie = cookies().get('token')?.value;
  const token = tokenFromHeader || tokenFromCookie;
  if (!token) {
    console.error('No token provided');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    jwt.verify(token, SECRET_KEY);
    const client = await clientPromise;
    const db = client.db('acmData');
    await db.collection('events').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event or token verification failed:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}