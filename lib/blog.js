import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export async function getAllBlogs({ page = 1, limit = 10, sort = 'recent' }) {
  const client = await clientPromise;
  const db = client.db('acmData');
  const sortOption = sort === 'popular' ? { upvotes: -1 } : { createdAt: -1 };
  const blogs = await db
    .collection('blogs')
    .find({})
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit)
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

export async function deleteBlogs(ids, authorEmail) {
  const client = await clientPromise;
  const db = client.db('acmData');
  const objectIds = ids.map((id) => new ObjectId(id));
  return await db
    .collection('blogs')
    .deleteMany({ _id: { $in: objectIds }, author: authorEmail });
}
