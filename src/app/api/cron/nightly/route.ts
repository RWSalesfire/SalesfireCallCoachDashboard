import { NextRequest, NextResponse } from 'next/server';
import { verifyCronSecret } from '@/lib/cronAuth';
import { runNightly, freshAlerts } from '@/lib/pipeline/runNightly';
import { sendTelegram, pingHealthcheck } from '@/lib/alerts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// Called by Supabase pg_cron. ?final=1 on the last run of the night adds the
// end-of-night checks (backlog cleared, calls recorded for yesterday).
export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const final = request.nextUrl.searchParams.get('final') === '1';

  try {
    const result = await runNightly({ final });
    const toSend = await freshAlerts(result.alerts, result.run_id);
    if (toSend.length > 0) await sendTelegram(toSend.map((a) => `• ${a}`).join('\n'));
    await pingHealthcheck(process.env.HC_PIPELINE_URL, result.stepFailed ? 'fail' : 'success');
    return NextResponse.json(result, { status: result.stepFailed ? 207 : 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await sendTelegram(`nightly run crashed: ${message.slice(0, 300)}`);
    await pingHealthcheck(process.env.HC_PIPELINE_URL, 'fail');
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
