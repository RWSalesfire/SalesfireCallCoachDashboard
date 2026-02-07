import { NextRequest, NextResponse } from 'next/server';
import { runEnrichCalls } from '@/lib/pipeline/enrichCalls';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function verifyCronSecret(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  if (auth === `Bearer ${process.env.CRON_SECRET}`) return true;
  const secret = request.nextUrl.searchParams.get('secret');
  return secret === process.env.CRON_SECRET;
}

export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const days = Number(request.nextUrl.searchParams.get('days')) || 2;

  try {
    const result = await runEnrichCalls(days);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Enrich calls error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
