import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { hasAnyRole } from '../../../../lib/admin';
import { sendBrevoEmail } from '../../../../lib/brevo';
import { uploadImage, deleteImage } from '../../../../lib/cloudinary';

const SECRET_KEY = process.env.JWT_SECRET;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
    const decoded = jwt.verify(token, SECRET_KEY);
    const email = decoded.email;
    if (!(await hasAnyRole(email, ['admin', 'editor']))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse new event
    const event = await req.json();
    // Upload image to Cloudinary if provided as data URL
    if (event.image) {
      const uploaded = await uploadImage(event.image, { folder: 'acm/events' });
      event.image = uploaded.url;
      event.imagePublicId = uploaded.public_id || event.imagePublicId || null;
    }

    // Insert event
    const client = await clientPromise;
    const db = client.db('acmData');
    const result = await db.collection('events').insertOne(event);

    // Fetch subscribers
    const subs = await db.collection('subscribers').find({}).toArray();
    const recipients = subs.map(s => ({ email: s.email }));

    // Prepare email content
    const subject = `New Event: ${event.title}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://acm-csulb.org';

    // Build a resilient logo URL for email (prefer Cloudinary fetch CDN if possible)
    const siteLogoSrc = `${baseUrl}/images/acm-csulb.png`;
    let logoUrl = siteLogoSrc;
    const cloudinaryUrl = process.env.CLOUDINARY_URL || '';
    const cloudMatch = cloudinaryUrl.match(/@([^/]+)$/); // extract cloud name from cloudinary://...@cloud_name
    if (process.env.NEXT_PUBLIC_ACM_LOGO_URL) {
      logoUrl = process.env.NEXT_PUBLIC_ACM_LOGO_URL;
    } else if (cloudMatch && cloudMatch[1]) {
      const cloudName = cloudMatch[1];
      // Use Cloudinary 'fetch' to cache our site logo on their CDN (works great in email clients)
      const encoded = encodeURIComponent(siteLogoSrc);
      logoUrl = `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto/${encoded}`;
    }

    // Event image absolute URL (if any)
    let eventImage = null;
    if (event.image) {
      if (event.image.startsWith('data:') || event.image.startsWith('http')) {
        eventImage = event.image;
      } else {
        eventImage = `${baseUrl}${event.image}`;
      }
    }

    // Google Calendar link
    const title = encodeURIComponent(event.title || 'ACM Event');
    const details = encodeURIComponent(event.description || '');
    const locationText = event.eventLocation || event.location || 'CSULB';
    const locationEnc = encodeURIComponent(locationText);
    const start = new Date(event.startDate);
    const end = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
    const allDay = Boolean(event.allDay);
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
        <h2 style="color:#00437b; margin:0 0 8px;">New Event Posted</h2>
        <h3 style="margin:0 0 12px;">${event.title}</h3>
        ${ eventImage ? `<div style="text-align:center;margin:20px 0;"><img src="${eventImage}" alt="${event.title}" width="560" style="max-width:100%; height:auto; border-radius:8px; display:block; margin:0 auto;" /></div>` : '' }
        <p style="margin:0 0 8px;">${event.description || ''}</p>
        <p style="margin:0 0 8px;"><strong>Date:</strong> ${new Date(event.startDate).toLocaleString()}</p>
        <p style="margin:0 0 16px;"><strong>Location:</strong> ${locationText}</p>
        <div style="text-align:center; margin-top:20px;">
          <a href="${gcalUrl}" style="background-color:#0B8043;color:#ffffff;padding:12px 16px;border-radius:4px;text-decoration:none;display:inline-block;margin-right:16px;">Add to Google Calendar</a>
          <a href="${baseUrl}/events" style="background-color:#00437b;color:#ffffff;padding:12px 16px;border-radius:4px;text-decoration:none;display:inline-block;">View All Events</a>
        </div>
        <div style="color:#6b7280; font-size:11px; text-align:center; margin-top:16px;">Images served via ${logoUrl.includes('res.cloudinary.com') ? 'Cloudinary' : 'CDN'}</div>
      </div>
    `;

    // Send notification email
    if (recipients.length) {
      await sendBrevoEmail({ to: recipients, subject, htmlContent });
    }

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.error('Error adding event or sending emails:', error);
    const status = /unauthorized|jwt/i.test(String(error?.message)) ? 401 : 500;
    const msg = status === 401 ? 'Unauthorized' : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status });
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
    const decoded = jwt.verify(token, SECRET_KEY);
    const email = decoded.email;
    if (!(await hasAnyRole(email, ['admin', 'editor']))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { ids } = await req.json();
    const client = await clientPromise;
    const db = client.db('acmData');
    const toDelete = await db.collection('events').find({
      _id: { $in: ids.map(id => new ObjectId(id)) }
    }).toArray();
    // delete Cloudinary images
    for (const ev of toDelete) {
      if (ev.imagePublicId) await deleteImage(ev.imagePublicId);
    }
    await db.collection('events').deleteMany({ _id: { $in: ids.map(id => new ObjectId(id)) } });
    return NextResponse.json({ message: 'Events deleted successfully' });
  } catch (error) {
    console.error('Error deleting events or token verification failed:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}