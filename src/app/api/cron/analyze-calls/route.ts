import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { analyzeCallTranscript } from '@/lib/claude';
import { Call } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 min — Vercel Pro/Enterprise

const MAX_CALLS_PER_RUN = 10;

function verifyCronSecret(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  if (auth === `Bearer ${process.env.CRON_SECRET}`) return true;
  // Also allow query param for manual testing
  const secret = request.nextUrl.searchParams.get('secret');
  return secret === process.env.CRON_SECRET;
}

export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    return NextResponse.json(
      { error: 'Supabase not configured', details: err instanceof Error ? err.message : 'Unknown' },
      { status: 503 }
    );
  }

  // Find calls with transcripts that haven't been analysed yet
  const { data: unanalyzed, error: fetchError } = await supabase
    .from('calls')
    .select('*')
    .not('transcript', 'is', null)
    .neq('transcript', '')
    .order('created_at', { ascending: true })
    .limit(MAX_CALLS_PER_RUN);

  if (fetchError) {
    console.error('Error fetching unanalyzed calls:', fetchError);
    return NextResponse.json({ error: 'Failed to fetch calls' }, { status: 500 });
  }

  if (!unanalyzed || unanalyzed.length === 0) {
    return NextResponse.json({ message: 'No unanalyzed calls found', processed: 0 });
  }

  // Filter out calls that already have analyses
  const callIds = unanalyzed.map((c: Call) => c.id);
  const { data: existingAnalyses } = await supabase
    .from('call_analyses')
    .select('call_id')
    .in('call_id', callIds);

  const analyzedCallIds = new Set((existingAnalyses || []).map((a: { call_id: string }) => a.call_id));
  const callsToAnalyze = unanalyzed.filter((c: Call) => !analyzedCallIds.has(c.id));

  if (callsToAnalyze.length === 0) {
    return NextResponse.json({ message: 'All calls already analyzed', processed: 0 });
  }

  const results: { call_id: string; success: boolean; error?: string }[] = [];

  for (const call of callsToAnalyze) {
    try {
      const analysis = await analyzeCallTranscript(call as Call);

      const { error: insertError } = await supabase
        .from('call_analyses')
        .insert({
          call_id: call.id,
          sdr_id: call.sdr_id,
          analysis_date: call.call_date,
          outcome: analysis.outcome,
          overall_score: analysis.overall_score,
          gatekeeper_score: analysis.gatekeeper_score,
          opener_score: analysis.opener_score,
          personalisation_score: analysis.personalisation_score,
          discovery_score: analysis.discovery_score,
          call_control_score: analysis.call_control_score,
          tone_energy_score: analysis.tone_energy_score,
          value_prop_score: analysis.value_prop_score,
          objections_score: analysis.objections_score,
          close_score: analysis.close_score,
          insight: analysis.insight,
          key_moment: analysis.key_moment,
          improvement: analysis.improvement,
          talk_time_percent: analysis.talk_time_percent,
          talk_speed_wpm: analysis.talk_speed_wpm,
          longest_monologue_seconds: analysis.longest_monologue_secs,
          customer_story_secs: analysis.customer_story_secs,
          patience_secs: analysis.patience_secs,
          area_breakdown: analysis.area_breakdown,
          raw_analysis: analysis,
        });

      if (insertError) {
        console.error(`Error inserting analysis for call ${call.id}:`, insertError);
        results.push({ call_id: call.id, success: false, error: insertError.message });
      } else {
        results.push({ call_id: call.id, success: true });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Error analyzing call ${call.id}:`, message);
      results.push({ call_id: call.id, success: false, error: message });
    }
  }

  const succeeded = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return NextResponse.json({
    processed: results.length,
    succeeded,
    failed,
    results,
  });
}

// Vercel cron triggers GET requests
export async function GET(request: NextRequest) {
  return POST(request);
}
