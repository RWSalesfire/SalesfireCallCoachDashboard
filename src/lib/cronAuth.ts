import { NextRequest } from 'next/server';

export function verifyCronSecret(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (request.headers.get('authorization') === `Bearer ${secret}`) return true;
  return request.nextUrl.searchParams.get('secret') === secret;
}
