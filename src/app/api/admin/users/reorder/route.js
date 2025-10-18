import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { isAdmin, reorderUsers } from '../../../../../../lib/admin';

const SECRET_KEY = process.env.JWT_SECRET;

export async function PUT(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { email } = jwt.verify(token, SECRET_KEY);
    if (!(await isAdmin(email))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { idOrder } = await req.json();
    if (!Array.isArray(idOrder)) {
      return NextResponse.json({ error: 'idOrder must be an array' }, { status: 400 });
    }
    const result = await reorderUsers(idOrder);
    return NextResponse.json({ modifiedCount: result.modifiedCount });
  } catch (e) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
