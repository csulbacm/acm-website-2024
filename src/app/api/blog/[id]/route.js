import { NextResponse } from 'next/server';
import { getBlogById, updateBlog } from '../../../../../lib/blog';
import { getAdminByEmail, hasAnyRole } from '../../../../../lib/admin';
import { uploadImage, deleteImage } from '../../../../../lib/cloudinary';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const blog = await getBlogById(id);
    if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

  // Ensure _id is a string for client usage
  const safe = { ...blog, _id: blog._id?.toString?.() || blog._id };
  return NextResponse.json(safe);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
    const { id } = params;
    const tokenCookie = cookies().get('token');
    const token = tokenCookie?.value;
  
    if (!token) {
      console.error('No token provided');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const email = decoded.email;
      if (!(await hasAnyRole(email, ['admin', 'editor']))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const adminName = decoded.name || (await getAdminByEmail(email))?.name;
  
  const blog = await getBlogById(id);
      if (!blog) {
        console.error('Blog not found');
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }
  const canonicalId = blog._id?.toString?.() || blog._id;
  
      const updates = await req.json();
      // Handle image upload
      if (updates.image) {
        const client = await clientPromise;
        const db = client.db('acmData');
        const existing = await db.collection('blogs').findOne({ _id: new ObjectId(canonicalId) });
        const uploaded = await uploadImage(updates.image, { folder: 'acm/blogs' });
        updates.image = uploaded.url;
        if (existing?.imagePublicId && uploaded.public_id && uploaded.public_id !== existing.imagePublicId) {
          await deleteImage(existing.imagePublicId);
        }
        updates.imagePublicId = uploaded.public_id || existing?.imagePublicId || null;
      }
      const updatedBlog = await updateBlog(canonicalId, updates);
  
      const safe = updatedBlog?.value
        ? { ...updatedBlog.value, _id: updatedBlog.value._id?.toString?.() || updatedBlog.value._id }
        : updatedBlog;
      return NextResponse.json({ message: 'Blog updated', blog: safe });
    } catch (error) {
      console.error('Error updating blog:', error);
      const status = /unauthorized|jwt/i.test(String(error?.message)) ? 401 : 500;
      const msg = status === 401 ? 'Unauthorized' : 'Internal Server Error';
      return NextResponse.json({ error: msg }, { status });
    }
  }
  