import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';

function safeCompare(a: string, b: string): boolean {
  const bufA = createHash('sha256').update(a).digest();
  const bufB = createHash('sha256').update(b).digest();
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const expectedUsername = process.env.AUTH_USERNAME;
  const expectedPassword = process.env.AUTH_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return NextResponse.json(
      { error: 'Authentication not configured' },
      { status: 500 }
    );
  }

  if (
    safeCompare(username ?? '', expectedUsername) &&
    safeCompare(password ?? '', expectedPassword)
  ) {
    const token = randomBytes(32).toString('hex');
    const response = NextResponse.json({ success: true });

    response.cookies.set('auth_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  }

  return NextResponse.json(
    { error: 'Invalid username or password' },
    { status: 401 }
  );
}
