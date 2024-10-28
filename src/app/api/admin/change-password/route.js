import bcrypt from 'bcrypt';
import clientPromise from '../../../../../lib/mongodb';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    // Ensure the method is POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }

    // Extract the JWT token from cookies
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    if (!token) {
      console.error('Token not found in cookies');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Verify the JWT token to get the email
    let email;
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      email = decoded.email;
    } catch (error) {
      console.error('Invalid or expired token');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Parse the request body to get the new password
    let parsedBody;
    try {
      parsedBody = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return new Response(JSON.stringify({ error: 'Invalid JSON input' }), { status: 400 });
    }

    const { newPassword } = parsedBody;

    // Validate new password presence
    if (!newPassword) {
      console.error('New password missing');
      return new Response(JSON.stringify({ error: 'New password is required' }), { status: 400 });
    }

    // Connect to the database and check for the admin user by email
    const client = await clientPromise;
    const db = client.db('acmData');
    const adminsCollection = db.collection('admins');

    const admin = await adminsCollection.findOne({ email });
    if (!admin) {
      console.error('Admin not found for email:', email);
      return new Response(JSON.stringify({ error: 'Admin not found' }), { status: 404 });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await adminsCollection.updateOne({ email }, { $set: { password: hashedNewPassword } });

    return new Response(JSON.stringify({ message: 'Password updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error in change-password route:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
