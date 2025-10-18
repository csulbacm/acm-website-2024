import clientPromise from './mongodb';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

export async function getAdminByEmail(email) {
    const client = await clientPromise;
    const db = client.db('acmData'); // Use your database name
    const admin = await db.collection('admins').findOne({ email });
    return admin;
  }

    // Backward-compatible: create user with role (defaults to 'editor' unless provided)
    export async function createAdmin({ email, hashedPassword, role = 'editor' }) {
        const client = await clientPromise;
        const db = client.db('acmData');

        // Determine the next order index (max existing order + 1)
        const [maxOrderDoc] = await db
            .collection('admins')
            .find({}, { projection: { order: 1 } })
            .sort({ order: -1 })
            .limit(1)
            .toArray();
        const nextOrder = (maxOrderDoc?.order ?? -1) + 1;

        // Create the new user with initial empty values for non-required fields
        return db.collection('admins').insertOne({
            email,
            password: hashedPassword,
            role,
            name: '',
            title: '',
            linkedin: '',
            github: '',
            website: '',
            image: '',
            imagePublicId: null,
            order: nextOrder,
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
            { returnDocument: 'after', includeResultMetadata: true, } // Return updated document
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

// Helpers for role-based access control
export async function getUserRoleByEmail(email) {
    const user = await getAdminByEmail(email);
    // Treat missing role as 'admin' for backward compatibility
    return user?.role || 'admin';
}

export async function hasAnyRole(email, roles = []) {
    const role = await getUserRoleByEmail(email);
    return roles.includes(role);
}

export async function isAdmin(email) {
    const role = await getUserRoleByEmail(email);
    return role === 'admin';
}

export async function listUsers() {
    const client = await clientPromise;
    const db = client.db('acmData');
    // Sort by order (missing go to end), then by name/email for stability
    const users = await db
        .collection('admins')
        .aggregate([
            { $addFields: { _orderSafe: { $ifNull: ["$order", 999999] } } },
            { $sort: { _orderSafe: 1, name: 1, email: 1 } },
            { $project: { password: 0, _orderSafe: 0 } },
        ])
        .toArray();
    return users;
}

export async function deleteUsersByIds(ids = [], actingAdminEmail) {
    const client = await clientPromise;
    const db = client.db('acmData');
    const objectIds = ids.map((id) => new ObjectId(id));

    // Prevent deleting self
    if (actingAdminEmail) {
        const self = await db.collection('admins').findOne({ email: actingAdminEmail });
        if (self && objectIds.some((oid) => oid.equals(self._id))) {
            throw new Error('Cannot delete your own account');
        }
    }

    // Guard against removing the last admin
    const adminCount = await db.collection('admins').countDocuments({ role: 'admin' });
    const adminsToDelete = await db
        .collection('admins')
        .countDocuments({ _id: { $in: objectIds }, role: 'admin' });
    if (adminCount - adminsToDelete <= 0) {
        throw new Error('Cannot delete the last admin');
    }

        const result = await db
        .collection('admins')
        .deleteMany({ _id: { $in: objectIds } });
    return result;
}

export async function updateUserRole({ id, email, role }) {
    if (!role || !['admin', 'editor'].includes(role)) {
        throw new Error('Invalid role');
    }
        const client = await clientPromise;
    const db = client.db('acmData');

    // Guard against removing the last admin via role change
    if (role === 'editor') {
        const target = id
            ? await db.collection('admins').findOne({ _id: new (await import('mongodb')).ObjectId(id) })
            : await db.collection('admins').findOne({ email });
        if (target?.role === 'admin') {
            const adminCount = await db.collection('admins').countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                throw new Error('Cannot downgrade the last admin');
            }
        }
    }

        const filter = id
            ? { _id: new ObjectId(id) }
            : { email };
    const result = await db.collection('admins').updateOne(filter, { $set: { role } });
    return result.modifiedCount > 0;
}

export async function setUserPassword({ id, email, newPassword }) {
    if (!newPassword) throw new Error('Password required');
    const client = await clientPromise;
    const db = client.db('acmData');
    const hashed = await bcrypt.hash(newPassword, 10);
        const filter = id
            ? { _id: new ObjectId(id) }
            : { email };
    const result = await db.collection('admins').updateOne(filter, { $set: { password: hashed } });
    return result.modifiedCount > 0;
}

// Reorder users based on an ordered array of ids
export async function reorderUsers(idOrder = []) {
    if (!Array.isArray(idOrder) || idOrder.length === 0) return { modifiedCount: 0 };
    const client = await clientPromise;
    const db = client.db('acmData');
    const ops = idOrder.map((id, index) => ({
        updateOne: {
            filter: { _id: new ObjectId(id) },
            update: { $set: { order: index } },
        },
    }));
    const res = await db.collection('admins').bulkWrite(ops, { ordered: false });
    const modifiedCount =
        (res.modifiedCount ?? 0) + (res.upsertedCount ?? 0) + (res.matchedCount ? 0 : 0);
    return { modifiedCount };
}