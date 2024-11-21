import { NextResponse } from 'next/server';
import { createBlog, getAllBlogs, deleteBlogs } from '../../../../lib/blog';
import { getAdminByEmail } from "../../../../lib/admin";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET;

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

    const admin = await getAdminByEmail(email);
    if (!admin) {
      console.error("Admin not found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminName = admin.name || "Unknown Author";

    const blogData = await req.json();
    blogData.author = adminName;
    blogData.createdAt = new Date();
    blogData.upvotes = 0;
    blogData.views = 0;
    blogData.upVoters = [];

    const result = await createBlog(blogData);
    return NextResponse.json({ message: 'Blog created', blogId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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

    // Retrieve admin's name from the database
    const admin = await getAdminByEmail(email);
    if (!admin) {
      console.error('Admin not found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authorName = admin.name; // Use the admin's name
    const { ids } = await req.json();

    const deleteResult = await deleteBlogs(ids, authorName);

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: 'No matching blogs found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blogs deleted successfully' });
  } catch (error) {
    console.error('Error deleting blogs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
