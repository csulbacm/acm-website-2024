import { NextResponse } from 'next/server';
import { createBlog, getAllBlogs, deleteBlogs } from '../../../../lib/blog';
import { getAdminByEmail, hasAnyRole } from "../../../../lib/admin";
import { uploadImage, deleteImage } from "../../../../lib/cloudinary";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const sort = searchParams.get('sort') || 'recent';

    const { blogs, totalPages } = await getAllBlogs({ page, sort });
    return NextResponse.json({ blogs, totalPages });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  const tokenCookie = cookies().get('token');
  const token = tokenCookie?.value;

  if (!token) {
    console.error('No token provided');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
  const decoded = jwt.verify(token, SECRET_KEY);
  const email = decoded.email;

  // allow admin or editor
  if (!(await hasAnyRole(email, ['admin', 'editor']))) {
      console.error("Admin not found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  const admin = await getAdminByEmail(email);
  const adminName = admin?.name || "Unknown Author";

    const blogData = await req.json();
    // Generate slug from title and ensure uniqueness
    const base = (blogData.title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    let slug = base || `post-${Date.now()}`;
    const client = await clientPromise;
    const db = client.db('acmData');
    if (slug) {
      const exists = await db.collection('blogs').findOne({ slug });
      if (exists) {
        let i = 2;
        while (await db.collection('blogs').findOne({ slug: `${base}-${i}` })) i++;
        slug = `${base}-${i}`;
      }
    }
    if (blogData.image) {
      const uploaded = await uploadImage(blogData.image, { folder: 'acm/blogs' });
      blogData.image = uploaded.url;
      blogData.imagePublicId = uploaded.public_id || null;
    }
  blogData.author = adminName;
  blogData.slug = slug;
    blogData.createdAt = new Date();
    blogData.upvotes = 0;
    blogData.views = 0;
    blogData.upVoters = [];

    const result = await createBlog(blogData);
    return NextResponse.json({ message: 'Blog created', blogId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    const status = /unauthorized|jwt/i.test(String(error?.message)) ? 401 : 500;
    const msg = status === 401 ? 'Unauthorized' : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(req) {
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

  const { ids } = await req.json();
  const client = await clientPromise;
  const db = client.db('acmData');
  const toDelete = await db.collection('blogs').find({ _id: { $in: ids.map((id)=> new ObjectId(id)) } }).toArray();
    for (const b of toDelete) {
      if (b.imagePublicId) await deleteImage(b.imagePublicId);
    }

    const deleteResult = await deleteBlogs(ids);

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: 'No matching blogs found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blogs deleted successfully' });
  } catch (error) {
    console.error('Error deleting blogs:', error);
    const status = /unauthorized|jwt/i.test(String(error?.message)) ? 401 : 500;
    const msg = status === 401 ? 'Unauthorized' : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status });
  }
}
