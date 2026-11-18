import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { scoreCall } from '@/lib/scoring/scoreCall';
import { RUBRIC_VERSION } from '@/lib/scoring/rubric';

const MAX_CALLS_PER_RUN = 3;
const PAGE_SIZE = 1000;
// Calls scored under an older rubric are re-scored if they're this recent, so
// the brief's "previous 4 weeks" comparison is like for like.
const RESCORE_DAYS = 28;

export interface AnalyzeResult {
  processed: number;
  succeeded: number;
  failed: number;
  rescored: number;
  results: { call_id: string; success: boolean; error?: string }[];
}

// New calls (transcribed, never scored), oldest first.
async function newCallIds(limit: number): Promise<string[]> {
  const db = getSupabaseAdmin();
  const analysed = new Set<string>();
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await db.from('call_analyses').select('call_id').range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`Failed to fetch analyses: ${error.message}`);
    (data || []).forEach((a: { call_id: string }) => analysed.add(a.call_id));
    if (!data || data.length < PAGE_SIZE) break;
  }

  // Filtered in code, not with `not.in.(...)`: every analysed ID in the URL
  // broke the request with "Bad Request" once there were ~640 (Oct 2026).
  const ids: string[] = [];
  for (let from = 0; ids.length < limit; from += PAGE_SIZE) {
    const { data, error } = await db.from('calls').select('id')
      .not('transcript', 'is', null).neq('transcript', '')
      .order('created_at', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`Failed to fetch calls: ${error.message}`);
    for (const c of data || []) {
      if (!analysed.has(c.id)) ids.push(c.id);
      if (ids.length >= limit) break;
    }
    if (!data || data.length < PAGE_SIZE) break;
  }
  return ids;
}

// Recent calls scored under an older rubric, newest first (the coming brief's
// week gets done first).
async function rescoreCallIds(limit: number): Promise<string[]> {
  if (limit <= 0) return [];
  const since = new Date(Date.now() - RESCORE_DAYS * 86_400_000).toISOString().split('T')[0];
  const { data, error } = await getSupabaseAdmin().from('call_analyses').select('call_id')
    .lt('rubric_version', RUBRIC_VERSION).gte('analysis_date', since)
    .order('analysis_date', { ascending: false }).limit(limit);
  if (error) throw new Error(`Failed to fetch calls to re-score: ${error.message}`);
  return (data || []).map((r: { call_id: string }) => r.call_id);
}

// Each call takes up to ~75s, so callers with a time budget pass a smaller limit.
export async function runAnalyzeCalls(limit: number = MAX_CALLS_PER_RUN): Promise<AnalyzeResult> {
  const empty: AnalyzeResult = { processed: 0, succeeded: 0, failed: 0, rescored: 0, results: [] };
  if (limit <= 0) return empty;
  const db = getSupabaseAdmin();

  const fresh = await newCallIds(limit);
  const rescore = await rescoreCallIds(limit - fresh.length);
  const ids = [...fresh, ...rescore];
  if (ids.length === 0) return empty;

  const { data: calls, error: fetchError } = await db.from('calls')
    .select('id, sdr_id, call_date, company, prospect_name, duration_ms, disposition_label, transcript')
    .in('id', ids);
  if (fetchError) throw new Error(`Failed to fetch calls: ${fetchError.message}`);

  const results: AnalyzeResult['results'] = [];
  for (const call of calls || []) {
    try {
      const s = await scoreCall(call);
      const { error } = await db.from('call_analyses').upsert({
        call_id: call.id,
        sdr_id: call.sdr_id,
        analysis_date: call.call_date,
        rubric_version: RUBRIC_VERSION,
        outcome: s.outcome,
        overall_score: s.overall_score,
        insight: s.insight,
        key_moment: s.key_moment,
        improvement: s.improvement,
        area_breakdown: s.beats,
        flags: s.claim_flags,
        raw_analysis: s,
        // v1 columns: no longer scored (v2 beats live in area_breakdown), and
        // the old talk-time "metrics" were guesses from an untimed transcript.
        gatekeeper_score: null, opener_score: null, personalisation_score: null, discovery_score: null,
        call_control_score: null, tone_energy_score: null, value_prop_score: null, objections_score: null,
        close_score: null, talk_time_percent: null, talk_speed_wpm: null, longest_monologue_secs: null,
        customer_story_secs: null, patience_secs: null,
      }, { onConflict: 'call_id' });
      results.push(error ? { call_id: call.id, success: false, error: error.message } : { call_id: call.id, success: true });
    } catch (err) {
      results.push({ call_id: call.id, success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }

  const succeeded = results.filter((r) => r.success).length;
  return {
    processed: results.length,
    succeeded,
    failed: results.length - succeeded,
    rescored: results.filter((r) => r.success && rescore.includes(r.call_id)).length,
    results,
  };
}
