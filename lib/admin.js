import clientPromise from './mongodb';
import bcrypt from 'bcrypt';

export async function getAdminByEmail(email) {
    const client = await clientPromise;
    const db = client.db('acmData'); // Use your database name
    const admin = await db.collection('admins').findOne({ email });
    return admin;
  }

  export async function createAdmin({ email, hashedPassword }) {
    const client = await clientPromise;
    const db = client.db('acmData');
    
    // Create the new admin with initial empty values for non-required fields
    return db.collection('admins').insertOne({
      email,
      password: hashedPassword,
      name: '',
      title: '',
      linkedin: '',
      github: '',
      website: '',
      image: '' // Or null if no image is provided initially
    });
  }
  
  export async function updateAdminProfile(email, profileData) {
    try {
        const client = await clientPromise;
        const db = client.db('acmData'); // Confirm this is the correct database name

        // Remove fields from profileData if they are null or undefined
        const filteredProfileData = Object.fromEntries(
            Object.entries(profileData).filter(([_, value]) => value !== null && value !== undefined && value !== '')
        );

        // Attempt to find and update the admin profile
        const result = await db.collection('admins').findOneAndUpdate(
            { email }, // Search for the admin by email
            { $set: filteredProfileData }, // Update with filtered profile data
            { returnDocument: 'after', returnNewDocument: true } // Return updated document
        );

        return result.value; // Return the updated profile directly
    } catch (error) {
        console.error('Error in updateAdminProfile:', error);
        throw error;
    }
}


  export async function updateAdminPassword(email, newPassword) {
    try {
        const client = await clientPromise;
        const db = client.db('acmData');
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update the password for the admin with the given email
        const result = await db.collection('admins').updateOne(
            { email }, // Search for the admin by email
            { $set: { password: hashedPassword } }
        );

        return result.modifiedCount > 0; // Return true if a document was modified
    } catch (error) {
        console.error('Error in updateAdminPassword:', error);
        throw error;
    }
}