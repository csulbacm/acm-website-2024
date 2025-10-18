import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { rateLimit } from '../../../../lib/rateLimit';

const limiter = rateLimit({ windowMs: 60_000, max: 10 });

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const { allowed, reset } = limiter(`contact:${ip}`);
    if (!allowed) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers: { 'Retry-After': String(Math.ceil((reset - Date.now())/1000)) } });
    }
    const { name, email, message } = await req.json();

    // Get the access token
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token, // Use the access token
      },
    });

    await transporter.sendMail({
      from: email, // Sender's email
      to: process.env.RECIPIENT, // Receiver's email
      subject: `Contact form submission from ${name}`,
      text: `You have a new message from ${name} (${email}): \n\n${message}`,
    });

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
