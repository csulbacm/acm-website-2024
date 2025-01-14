import { NextResponse } from 'next/server';
import { getBlogById, updateBlog } from '../../../../../lib/blog';
import { getAdminByEmail } from '../../../../../lib/admin';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const blog = await getBlogById(id);
    if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });

    return NextResponse.json(blog);
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
  
      // Assuming the admin's name is stored in the token payload or fetched via `email`
      const adminName = decoded.name || (await getAdminByEmail(email))?.name;
  
      if (!adminName) {
        console.error("Admin name not found");
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const blog = await getBlogById(id);
      if (!blog) {
        console.error('Blog not found');
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }
  
      const updates = await req.json();
      const updatedBlog = await updateBlog(id, updates);
  
      return NextResponse.json({ message: 'Blog updated', blog: updatedBlog.value });
    } catch (error) {
      console.error('Error updating blog:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  