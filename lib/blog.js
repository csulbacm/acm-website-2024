import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export async function getAllBlogs({ page = 1, limit = 10, sort = 'recent' }) {
  const client = await clientPromise;
  const db = client.db('acmData');

  const sortOption =
    sort === 'popular'
      ? { popularity: -1 } // Sort by popularity score
      : { createdAt: -1 }; // Sort by recent creation date

  const blogs = await db
    .collection('blogs')
    .aggregate([
      {
        $addFields: {
          popularity: { $add: [{ $multiply: ['$upvotes', 2] }, '$views'] },
          // Calculate popularity as: (Upvotes * 2) + Views
        },
      },
      {
        $sort: sortOption, // Apply the sorting option
      },
      {
        $skip: (page - 1) * limit, // Pagination skip
      },
      {
        $limit: limit, // Pagination limit
      },
    ])
    .toArray();

  const totalBlogs = await db.collection('blogs').countDocuments();
  return { blogs, totalPages: Math.ceil(totalBlogs / limit) };
}

export async function getBlogById(id) {
  const client = await clientPromise;
  const db = client.db('acmData');
  return await db.collection('blogs').findOne({ _id: new ObjectId(id) });
}

export async function createBlog(blogData) {
  const client = await clientPromise;
  const db = client.db('acmData');
  return await db.collection('blogs').insertOne(blogData);
}

export async function updateBlog(id, updates) {
  const client = await clientPromise;
  const db = client.db('acmData');
  return await db
    .collection('blogs')
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updates }, { returnDocument: 'after' });
}

export async function deleteBlogs(ids) {
  const client = await clientPromise;
  const db = client.db('acmData');

  // Convert IDs to ObjectId
  let objectIds;
  try {
    objectIds = ids.map((id) => new ObjectId(id));
  } catch (error) {
    console.error('Invalid ID format:', ids, error);
    throw new Error('Invalid ID format');
  }

  // Execute delete query
  const result = await db
    .collection('blogs')
    .deleteMany({ _id: { $in: objectIds } });

  return result;
}
