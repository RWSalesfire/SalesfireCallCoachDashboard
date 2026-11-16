import { NextRequest, NextResponse } from 'next/server';
import { verifyCronSecret } from '@/lib/cronAuth';
import { sendPodBriefs } from '@/lib/briefs/sendPodBriefs';
import { sendTelegram, pingHealthcheck, isCreditError } from '@/lib/alerts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// Called by Supabase pg_cron on Monday morning (with a retry 20 minutes later;
// the retry only sends what the first run didn't).
export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const result = await sendPodBriefs();
    if (result.alerts.length > 0) {
      const urgent = result.alerts.some(isCreditError) ? 'URGENT ' : '';
      await sendTelegram(`${urgent}weekly briefs:\n${result.alerts.map((a) => `• ${a}`).join('\n')}`);
    }
    await pingHealthcheck(process.env.HC_BRIEF_URL, result.failed.length ? 'fail' : 'success');
    return NextResponse.json(result, { status: result.failed.length ? 207 : 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await sendTelegram(`weekly briefs crashed: ${message.slice(0, 300)}`);
    await pingHealthcheck(process.env.HC_BRIEF_URL, 'fail');
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
