import axios from 'axios';

const BREVO_KEY = process.env.BREVO_API_KEY;
const SENDER = {
  email: process.env.BREVO_SENDER_EMAIL,
  name: process.env.BREVO_SENDER_NAME,
};

export async function sendBrevoEmail({ to, subject, htmlContent }) {
  await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    { sender: SENDER, to, subject, htmlContent },
    {
      headers: {
        'api-key': BREVO_KEY,
        'content-type': 'application/json',
        'accept': 'application/json',
      },
    }
  );
}
