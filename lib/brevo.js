// lib/brevo.js
import axios from 'axios';

const BREVO_KEY        = process.env.BREVO_API_KEY;
const SENDER           = {
  email: process.env.BREVO_SENDER_EMAIL,
  name:  process.env.BREVO_SENDER_NAME,
};
const BASE_URL = 'https://csulb-acm.org';

/**
 * Send an email via Brevo SMTP API, including List-Unsubscribe headers.
 *
 * @param {{
 *   to:           Array<{ email: string }>;
 *   subject:      string;
 *   htmlContent:  string;
 *   replyTo?:     string | { email: string, name?: string };
 * }}
 */
export async function sendBrevoEmail({ to, subject, htmlContent, replyTo }) {
  if (!to?.length) return;

  // we’ll point List-Unsubscribe at both a mailto: and our GET endpoint
  const first = encodeURIComponent(to[0].email);
  const mailtoLink = `<mailto:${SENDER.email}?subject=unsubscribe>`;
  const httpLink   = `<${BASE_URL}/api/unsubscribe?email=${first}>`;
  const listUnsub  = `${mailtoLink}, ${httpLink}`;

  const payload = {
    sender:      SENDER,
    to,
    subject,
    htmlContent,
    headers: {
      // primary unsubscribe header
      'List-Unsubscribe':        listUnsub,

      'List-Unsubscribe-Post':   'List-Unsubscribe=One-Click'
    },
  };

  if (replyTo) {
    payload.replyTo = typeof replyTo === 'string' ? { email: replyTo } : replyTo;
  }

  await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    payload,
    {
      headers: {
        'api-key':         BREVO_KEY,
        'Content-Type':    'application/json',
        Accept:            'application/json',
      },
    }
  );
}
