import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 400 });
  }

  (await cookies()).set('token', token, {
    maxAge: 60 * 60 * 24 * 5,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  });

  return NextResponse.json({ status: 'success', message: 'Session cookie set' });
}