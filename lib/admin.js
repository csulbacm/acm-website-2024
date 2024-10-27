import clientPromise from './mongodb';

export async function getAdminByEmail(email) {
    const client = await clientPromise;
    const db = client.db('acmData'); // Use your database name
    const admin = await db.collection('admins').findOne({ email });
    return admin;
  }

export async function createAdmin({ email, hashedPassword }) {
  const client = await clientPromise; // Await client resolution
  const db = client.db('acmData'); // Replace with your database name
  return db.collection('admins').insertOne({ email, password: hashedPassword });
}
