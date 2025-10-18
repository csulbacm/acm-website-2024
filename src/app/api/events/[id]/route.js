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

// Helper: only notify for future events
function isFutureEvent(evt) {
  if (!evt?.startDate) return false;
  const start = new Date(evt.startDate);
  if (Number.isNaN(start.getTime())) return false;
  return start.getTime() > Date.now();
}

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

    // Prepare email content for update
    const subject = `Updated Event: ${updatedEvent.title}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://acm-csulb.org';

    // Build robust logo URL (prefer Cloudinary fetch)
    const siteLogoSrc = `${baseUrl}/images/acm-csulb.png`;
    let logoUrl = siteLogoSrc;
    const cloudinaryUrl = process.env.CLOUDINARY_URL || '';
    const cloudMatch = cloudinaryUrl.match(/@([^/]+)$/);
    if (process.env.NEXT_PUBLIC_ACM_LOGO_URL) {
      logoUrl = process.env.NEXT_PUBLIC_ACM_LOGO_URL;
    } else if (cloudMatch && cloudMatch[1]) {
      const cloudName = cloudMatch[1];
      const encoded = encodeURIComponent(siteLogoSrc);
      logoUrl = `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto/${encoded}`;
    }

    // Event image absolute URL (if any)
    let eventImage = null;
    if (updatedEvent.image) {
      if (updatedEvent.image.startsWith('data:') || updatedEvent.image.startsWith('http')) {
        eventImage = updatedEvent.image;
      } else {
        eventImage = `${baseUrl}${updatedEvent.image}`;
      }
    }

    // Google Calendar link for updated event
    const title = encodeURIComponent(updatedEvent.title || 'ACM Event');
    const details = encodeURIComponent(updatedEvent.description || '');
    const locationText = updatedEvent.eventLocation || updatedEvent.location || 'CSULB';
    const locationEnc = encodeURIComponent(locationText);
    const start = new Date(updatedEvent.startDate);
    const end = updatedEvent.endDate ? new Date(updatedEvent.endDate) : new Date(updatedEvent.startDate);
    const allDay = Boolean(updatedEvent.allDay);
    const fmtDate = (d) => {
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(d.getUTCDate()).padStart(2, '0');
      return `${yyyy}${mm}${dd}`;
    };
    const fmtDateTime = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const datesParam = allDay
      ? `${fmtDate(start)}/${fmtDate(end)}`
      : `${fmtDateTime(start)}/${fmtDateTime(end)}`;
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${locationEnc}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
        <div style="text-align:center; margin-bottom:20px;">
          <img src="${logoUrl}" alt="ACM CSULB Logo" style="display:block; margin:0 auto; border:0; outline:none; text-decoration:none; width:120px; max-width:120px; height:auto;" />
        </div>
        <h2 style="color:#00437b; margin:0 0 8px;">Event Updated</h2>
        <h3 style="margin:0 0 12px;">${updatedEvent.title}</h3>
        ${ eventImage ? `<div style=\"text-align:center;margin:20px 0;\"><img src=\"${eventImage}\" alt=\"${updatedEvent.title}\" width=\"560\" style=\"max-width:100%; height:auto; border-radius:8px; display:block; margin:0 auto;\" /></div>` : '' }
        <p style="margin:0 0 8px;">${updatedEvent.description || ''}</p>
        <p style="margin:0 0 8px;"><strong>Date:</strong> ${new Date(updatedEvent.startDate).toLocaleString()}</p>
        <p style="margin:0 0 16px;"><strong>Location:</strong> ${locationText}</p>
        <div style="text-align:center; margin-top:20px;">
          <a href="${gcalUrl}" style="background-color:#0B8043;color:#ffffff;padding:12px 16px;border-radius:4px;text-decoration:none;display:inline-block;margin-right:16px;">Update in Google Calendar</a>
          <a href="${baseUrl}/events" style="background-color:#00437b;color:#ffffff;padding:12px 16px;border-radius:4px;text-decoration:none;display:inline-block;">View All Events</a>
        </div>
      </div>
    `;

  // Send update email only for future events
  if (recipients.length && isFutureEvent(updatedEvent)) {
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

    if (!existing) {
      return NextResponse.json({ message: 'Event deleted' });
    }

    // Delete Cloudinary image if present
    if (existing.imagePublicId) await deleteImage(existing.imagePublicId);

    // Delete the event
    await db.collection('events').deleteOne({ _id: new ObjectId(id) });

  // Notify subscribers of cancellation (future events only)
  const subs = await db.collection('subscribers').find({}).toArray();
  const recipients = subs.map(s => ({ email: s.email }));

  if (recipients.length && isFutureEvent(existing)) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://acm-csulb.org';

      const siteLogoSrc = `${baseUrl}/images/acm-csulb.png`;
      let logoUrl = siteLogoSrc;
      const cloudinaryUrl = process.env.CLOUDINARY_URL || '';
      const cloudMatch = cloudinaryUrl.match(/@([^/]+)$/);
      if (process.env.NEXT_PUBLIC_ACM_LOGO_URL) {
        logoUrl = process.env.NEXT_PUBLIC_ACM_LOGO_URL;
      } else if (cloudMatch && cloudMatch[1]) {
        const cloudName = cloudMatch[1];
        const encoded = encodeURIComponent(siteLogoSrc);
        logoUrl = `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto/${encoded}`;
      }

      const locationText = existing.eventLocation || existing.location || 'CSULB';
      const subject = `Canceled: ${existing.title}`;
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
          <div style="text-align:center; margin-bottom:20px;">
            <img src="${logoUrl}" alt="ACM CSULB Logo" style="display:block; margin:0 auto; border:0; outline:none; text-decoration:none; width:120px; max-width:120px; height:auto;" />
          </div>
          <h2 style="color:#B91C1C; margin:0 0 8px;">Event Canceled</h2>
          <h3 style="margin:0 0 12px;">${existing.title}</h3>
          <p style="margin:0 0 8px; color:#6b7280;">We’re sorry—this event has been canceled.</p>
          <p style="margin:0 0 8px;"><strong>Original Date:</strong> ${new Date(existing.startDate).toLocaleString()}</p>
          <p style="margin:0 0 16px;"><strong>Location:</strong> ${locationText}</p>
          <div style="text-align:center; margin-top:20px;">
            <a href="${baseUrl}/events" style="background-color:#00437b;color:#ffffff;padding:12px 16px;border-radius:4px;text-decoration:none;display:inline-block;">View All Events</a>
          </div>
        </div>
      `;

  await sendBrevoEmail({ to: recipients, subject, htmlContent });
    }

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event or token verification failed:', error);
    const status = /unauthorized|jwt/i.test(String(error?.message)) ? 401 : 500;
    const msg = status === 401 ? 'Unauthorized' : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status });
  }
}