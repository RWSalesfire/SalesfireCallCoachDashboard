import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { analyzeCallTranscript } from '@/lib/claude';
import { Call as DBCall } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function verifyCronSecret(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  if (auth === `Bearer ${process.env.CRON_SECRET}`) return true;
  const secret = request.nextUrl.searchParams.get('secret');
  return secret === process.env.CRON_SECRET;
}

const SCORE_TO_AREA: Record<string, string> = {
  gatekeeper_score: 'gatekeeper',
  opener_score: 'opener',
  personalisation_score: 'personalisation',
  discovery_score: 'discovery',
  call_control_score: 'callControl',
  tone_energy_score: 'toneEnergy',
  value_prop_score: 'valueProp',
  objections_score: 'objections',
  close_score: 'close',
};

const AREA_LABELS: Record<string, string> = {
  gatekeeper: 'Gatekeeper',
  opener: 'Opener',
  personalisation: 'Personalisation',
  discovery: 'Discovery',
  callControl: 'Call Control',
  toneEnergy: 'Tone & Energy',
  valueProp: 'Value Prop',
  objections: 'Objections',
  close: 'Close',
};

function ensureCompleteBreakdown(
  analysis: Record<string, unknown>,
): Record<string, { score: number; why: string; well: string; improve: string; try_next: string }> {
  const breakdown = (analysis.area_breakdown || {}) as Record<
    string,
    { score: number; why: string; well: string; improve: string; try_next: string }
  >;

  for (const [scoreField, areaKey] of Object.entries(SCORE_TO_AREA)) {
    const scoreValue = analysis[scoreField];
    if (typeof scoreValue === 'number' && !(areaKey in breakdown)) {
      const label = AREA_LABELS[areaKey] || areaKey;
      breakdown[areaKey] = {
        score: scoreValue,
        why: `${label} was scored ${scoreValue}/10.`,
        well: 'Analysis pending for this area.',
        improve: 'Analysis pending for this area.',
        try_next: `Focus on improving ${label} in your next calls.`,
      };
    }
  }

  return breakdown;
}

async function backfillBreakdowns() {
  const supabase = getSupabaseAdmin();

  // Get Monday of this week
  const now = new Date();
  const dayOfWeek = now.getUTCDay() || 7;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - dayOfWeek + 1);
  const weekStart = monday.toISOString().split('T')[0];

  // Get this week's analyses
  const { data: analyses, error: fetchError } = await supabase
    .from('call_analyses')
    .select('*')
    .gte('analysis_date', weekStart);

  if (fetchError) throw new Error(`Failed to fetch analyses: ${fetchError.message}`);
  if (!analyses || analyses.length === 0) {
    return { message: 'No analyses found for this week', processed: 0 };
  }

  // Filter to those missing valueProp in area_breakdown
  const needsBackfill = analyses.filter((a) => {
    const bd = a.area_breakdown as Record<string, unknown> | null;
    return a.value_prop_score != null && (!bd || !('valueProp' in bd));
  });

  if (needsBackfill.length === 0) {
    return { message: 'All analyses already have VP breakdowns', total: analyses.length, processed: 0 };
  }

  // Get the call transcripts for these analyses
  const callIds = needsBackfill.map((a) => a.call_id);
  const { data: calls } = await supabase
    .from('calls')
    .select('*')
    .in('id', callIds);

  const callMap = new Map((calls || []).map((c) => [c.id, c]));

  const results: { call_id: string; company: string; success: boolean; error?: string }[] = [];

  for (const analysis of needsBackfill) {
    const call = callMap.get(analysis.call_id);
    if (!call || !call.transcript) {
      results.push({ call_id: analysis.call_id, company: call?.company || 'Unknown', success: false, error: 'No transcript' });
      continue;
    }

    try {
      // Re-analyze with Claude to get full breakdowns including VP
      const newAnalysis = await analyzeCallTranscript(call as DBCall);
      const completeBreakdown = ensureCompleteBreakdown(newAnalysis as unknown as Record<string, unknown>);

      // Update just the area_breakdown and scores in the existing analysis
      const { error: updateError } = await supabase
        .from('call_analyses')
        .update({
          area_breakdown: completeBreakdown,
          value_prop_score: newAnalysis.value_prop_score,
          raw_analysis: newAnalysis,
        })
        .eq('id', analysis.id);

      if (updateError) {
        results.push({ call_id: analysis.call_id, company: call.company || 'Unknown', success: false, error: updateError.message });
      } else {
        results.push({ call_id: analysis.call_id, company: call.company || 'Unknown', success: true });
      }
    } catch (err) {
      results.push({
        call_id: analysis.call_id,
        company: call.company || 'Unknown',
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return {
    weekStart,
    totalAnalyses: analyses.length,
    needsBackfill: needsBackfill.length,
    succeeded: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  };
}

export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await backfillBreakdowns();
    return NextResponse.json(result);
  } catch (err) {
    console.error('Backfill breakdowns error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
