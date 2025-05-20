// lib/brevo.js
import axios from 'axios';

const BREVO_KEY = process.env.BREVO_API_KEY;
const SENDER = {
  email: process.env.BREVO_SENDER_EMAIL,
  name: process.env.BREVO_SENDER_NAME,
};
// Base URL for unsubscribe links (no trailing slash)
const BASE_URL = 'https://acmcsulb.com';

/**
 * Send an email via Brevo SMTP API, including List-Unsubscribe header.
 * @param {{ to: Array<{ email: string }> ; subject: string; htmlContent: string; }}
 */
export async function sendBrevoEmail({ to, subject, htmlContent }) {
  if (!to || !to.length) return;

  // Construct List-Unsubscribe header pointing to our unsubscribe API
  const firstRecipient = to[0].email;
  const unsubscribeUrl = `${BASE_URL}/api/unsubscribe?email=${encodeURIComponent(firstRecipient)}`;
  const listUnsubscribeHeader = `<${unsubscribeUrl}>`;

  const payload = {
    sender: SENDER,
    to,
    subject,
    htmlContent,
    headers: {
      'List-Unsubscribe': listUnsubscribeHeader,
    },
  };

  await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    payload,
    {
      headers: {
        'api-key': BREVO_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );
}