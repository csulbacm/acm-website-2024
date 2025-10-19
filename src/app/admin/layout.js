import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export default function AdminLayout({ children }) {
  const token = cookies().get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    jwt.verify(token, SECRET_KEY);
  } catch {
    redirect('/login');
  }

  return (
    <>
      {children}
    </>
  );
}
