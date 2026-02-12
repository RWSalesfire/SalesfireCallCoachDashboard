import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { analyzeCallTranscript } from '@/lib/claude';
import { Call } from '@/lib/supabase';

const MAX_CALLS_PER_RUN = 10;

// Map score fields to their area_breakdown keys
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

/**
 * Ensure every non-null score has a corresponding area_breakdown entry.
 * If Claude omitted an area, insert a minimal placeholder so the UI can render it.
 */
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

export interface AnalyzeResult {
  processed: number;
  succeeded: number;
  failed: number;
  results: { call_id: string; success: boolean; error?: string }[];
}

export async function runAnalyzeCalls(): Promise<AnalyzeResult> {
  const supabase = getSupabaseAdmin();

  // Get IDs of calls that already have analyses
  const { data: existingAnalyses } = await supabase
    .from('call_analyses')
    .select('call_id');

  const analyzedCallIds = (existingAnalyses || []).map((a: { call_id: string }) => a.call_id);

  // Find calls with transcripts that haven't been analysed yet
  let query = supabase
    .from('calls')
    .select('*')
    .not('transcript', 'is', null)
    .neq('transcript', '')
    .order('created_at', { ascending: true })
    .limit(MAX_CALLS_PER_RUN);

  if (analyzedCallIds.length > 0) {
    query = query.not('id', 'in', `(${analyzedCallIds.join(',')})`);
  }

  const { data: callsToAnalyze, error: fetchError } = await query;

  if (fetchError) {
    throw new Error(`Failed to fetch calls: ${fetchError.message}`);
  }

  if (!callsToAnalyze || callsToAnalyze.length === 0) {
    return { processed: 0, succeeded: 0, failed: 0, results: [] };
  }

  const results: { call_id: string; success: boolean; error?: string }[] = [];

  for (const call of callsToAnalyze) {
    try {
      const analysis = await analyzeCallTranscript(call as Call);

      // Ensure all scored areas have breakdown entries (safety net for incomplete Claude responses)
      const completeBreakdown = ensureCompleteBreakdown(analysis as unknown as Record<string, unknown>);

      const roundInt = (v: number | null | undefined) => v != null ? Math.round(v) : null;

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
          talk_speed_wpm: roundInt(analysis.talk_speed_wpm),
          longest_monologue_secs: roundInt(analysis.longest_monologue_secs),
          customer_story_secs: roundInt(analysis.customer_story_secs),
          patience_secs: roundInt(analysis.patience_secs),
          area_breakdown: completeBreakdown,
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

  return { processed: results.length, succeeded, failed, results };
}
