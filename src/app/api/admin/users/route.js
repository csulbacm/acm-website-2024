import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  listUsers,
  createAdmin,
  deleteUsersByIds,
  updateUserRole,
  setUserPassword,
  isAdmin,
} from '../../../../../lib/admin';

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { email } = jwt.verify(token, SECRET_KEY);
    if (!(await isAdmin(email))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const users = await listUsers();
    return NextResponse.json({ users });
  } catch (e) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req) {
  // Admin creates a new user with a role
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { email: actor } = jwt.verify(token, SECRET_KEY);
    if (!(await isAdmin(actor))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { email, password, role = 'editor' } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await createAdmin({ email, hashedPassword, role });
    return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(req) {
  // Admin updates role or password
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { email: actor } = jwt.verify(token, SECRET_KEY);
    if (!(await isAdmin(actor))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    if (body.role && (body.id || body.email)) {
      const ok = await updateUserRole({ id: body.id, email: body.email, role: body.role });
      if (!ok) return NextResponse.json({ error: 'No update performed' }, { status: 400 });
      return NextResponse.json({ message: 'Role updated' });
    }
    if (body.newPassword && (body.id || body.email)) {
      const ok = await setUserPassword({ id: body.id, email: body.email, newPassword: body.newPassword });
      if (!ok) return NextResponse.json({ error: 'No update performed' }, { status: 400 });
      return NextResponse.json({ message: 'Password updated' });
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { email: actor } = jwt.verify(token, SECRET_KEY);
    if (!(await isAdmin(actor))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { ids } = await req.json();
    if (!Array.isArray(ids) || !ids.length) return NextResponse.json({ error: 'No ids provided' }, { status: 400 });
    const result = await deleteUsersByIds(ids, actor);
    return NextResponse.json({ deletedCount: result.deletedCount });
  } catch (e) {
    const msg = e?.message || 'Unauthorized';
    const status = msg.includes('Cannot') ? 400 : 401;
    return NextResponse.json({ error: msg }, { status });
  }
}
