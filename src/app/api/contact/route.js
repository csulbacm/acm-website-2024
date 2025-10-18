import { NextResponse } from 'next/server';
import { rateLimit } from '../../../../lib/rateLimit';
import DOMPurify from 'isomorphic-dompurify';
import { sendBrevoEmail } from '../../../../lib/brevo';

const limiter = rateLimit({ windowMs: 60_000, max: 10 });

export const runtime = 'nodejs';

// Per-IP and per-email rate-limiters
const ipLimiter = rateLimit({ windowMs: 60_000, max: 10 }); // 10/min per IP
const emailLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 }); // 5/hour per email

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    const { allowed, reset } = ipLimiter(`contact:${ip}`);
    if (!allowed) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers: { 'Retry-After': String(Math.ceil((reset - Date.now())/1000)) } });
    }
    const { name, email, message, website } = await req.json();

    // Honeypot: 'website' should remain empty
    if (website) {
      return NextResponse.json({ message: 'Thanks!' }, { status: 200 });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing name, email, or message' }, { status: 400 });
    }

    // Basic validation and limits
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email) || String(name).length > 120) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const rawMessage = String(message).slice(0, 3000);
    const safeMessage = DOMPurify.sanitize(rawMessage);

    // Per-email throttle
    const { allowed: emailAllowed, reset: emailReset } = emailLimiter(`contact-email:${email.toLowerCase()}`);
    if (!emailAllowed) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers: { 'Retry-After': String(Math.ceil((emailReset - Date.now())/1000)) } });
    }

    // Optional minimum submit time (client can set x-form-start header ms since epoch)
    const formStart = Number(req.headers.get('x-form-start') || 0);
    if (formStart && Date.now() - formStart < 2000) {
      return NextResponse.json({ error: 'Form submitted too quickly' }, { status: 400 });
    }

    const RECIPIENT = process.env.RECIPIENT;
    if (!RECIPIENT) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

  const subject = `Contact form submission from ${name}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:16px;">
        <h3 style="margin:0 0 12px;">New Contact Form Submission</h3>
        <p style="margin:0 0 8px;"><strong>Name:</strong> ${name}</p>
        <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
        <p style="margin:0 0 8px;"><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap; word-wrap:break-word; background:#f9fafb; padding:12px; border-radius:8px;">${safeMessage}</pre>
      </div>
    `;

    await sendBrevoEmail({
      to: [{ email: RECIPIENT }],
      subject,
      htmlContent,
      replyTo: { email, name },
    });

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
  return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
