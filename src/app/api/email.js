import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    // Create a Nodemailer transporter using SMTP (Gmail in this case)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail account
        pass: process.env.GMAIL_PASS, // Your Gmail password or App-specific password
      },
    });

    try {
      // Send email
      await transporter.sendMail({
        from: email, // Sender's email
        to: process.env.RECIPIENT, // Your email (receiver)
        subject: `Contact form submission from ${name}`,
        text: `You have a new message from ${name} (${email}): \n\n${message}`,
      });

      // Send success response
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      // Send error response
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    // Handle non-POST requests
    res.status(405).json({ error: 'Method not allowed' });
  }
}