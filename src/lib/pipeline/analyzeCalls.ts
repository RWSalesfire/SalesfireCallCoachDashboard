import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { analyzeCallTranscript } from '@/lib/claude';
import { Call } from '@/lib/supabase';

const MAX_CALLS_PER_RUN = 10;

export interface AnalyzeResult {
  processed: number;
  succeeded: number;
  failed: number;
  results: { call_id: string; success: boolean; error?: string }[];
}

export async function runAnalyzeCalls(): Promise<AnalyzeResult> {
  const supabase = getSupabaseAdmin();

  // Find calls with transcripts that haven't been analysed yet
  const { data: unanalyzed, error: fetchError } = await supabase
    .from('calls')
    .select('*')
    .not('transcript', 'is', null)
    .neq('transcript', '')
    .order('created_at', { ascending: true })
    .limit(MAX_CALLS_PER_RUN);

  if (fetchError) {
    throw new Error(`Failed to fetch calls: ${fetchError.message}`);
  }

  if (!unanalyzed || unanalyzed.length === 0) {
    return { processed: 0, succeeded: 0, failed: 0, results: [] };
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
    return { processed: 0, succeeded: 0, failed: 0, results: [] };
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
          longest_monologue_secs: analysis.longest_monologue_secs,
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

  return { processed: results.length, succeeded, failed, results };
}
