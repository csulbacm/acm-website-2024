import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { hasAnyRole } from '../../../../../lib/admin';
import { cookies } from 'next/headers';
import { sendBrevoEmail } from '../../../../../lib/brevo';
import { uploadImage, deleteImage } from '../../../../../lib/cloudinary';

const SECRET_KEY = process.env.JWT_SECRET;
export const runtime = 'nodejs';

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
    const decoded = jwt.verify(token, SECRET_KEY);
    const email = decoded.email;
    if (!(await hasAnyRole(email, ['admin', 'editor']))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse updated event data
    const updatedEvent = await req.json();
    const client = await clientPromise;
    const db = client.db('acmData');
    // If a new image is provided, upload and possibly delete old
    if (updatedEvent.image) {
      const existing = await db.collection('events').findOne({ _id: new ObjectId(id) });
      const uploaded = await uploadImage(updatedEvent.image, { folder: 'acm/events' });
      updatedEvent.image = uploaded.url;
      const newPid = uploaded.public_id || existing?.imagePublicId || null;
      if (existing?.imagePublicId && uploaded.public_id && uploaded.public_id !== existing.imagePublicId) {
        await deleteImage(existing.imagePublicId);
      }
      updatedEvent.imagePublicId = newPid;
    }
    await db.collection('events').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedEvent }
    );

    // Fetch subscribers
    const subs = await db.collection('subscribers').find({}).toArray();
    const recipients = subs.map(s => ({ email: s.email }));

    // Prepare email content
  const subject = `Updated Event: ${updatedEvent.title}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://acm-csulb.org';
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
          <a href="${baseUrl}/events" style="background-color:#00437b;color:#ffffff;padding:12px 24px;border-radius:4px;text-decoration:none;">View All Events</a>
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
    const status = /unauthorized|jwt/i.test(String(error?.message)) ? 401 : 500;
    const msg = status === 401 ? 'Unauthorized' : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status });
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
    const decoded = jwt.verify(token, SECRET_KEY);
    const email = decoded.email;
    if (!(await hasAnyRole(email, ['admin', 'editor']))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const client = await clientPromise;
  const db = client.db('acmData');
  const existing = await db.collection('events').findOne({ _id: new ObjectId(id) });
  if (existing?.imagePublicId) await deleteImage(existing.imagePublicId);
  await db.collection('events').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event or token verification failed:', error);
    const status = /unauthorized|jwt/i.test(String(error?.message)) ? 401 : 500;
    const msg = status === 401 ? 'Unauthorized' : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status });
  }
}