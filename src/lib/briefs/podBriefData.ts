// Facts for the weekly pod brief. Every number in the email comes from here,
// never from Claude, so the figures can be trusted.

import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { BEAT_LABELS, RUBRIC_VERSION } from '@/lib/scoring/rubric';
import type { ClaimFlag } from '@/lib/scoring/scoreCall';

export interface Pod {
  sdr_id: string;
  pe_name: string;
  pe_email: string;
  gd_name: string;
  gd_email: string;
}

export interface ScoredCall {
  company: string;
  date: string;
  overall: number;
  insight: string;
  key_moment: string;
  improvement: string;
  areas: Record<string, { score: number; well: string; improve: string; try_next: string }>;
  claim_flags: ClaimFlag[]; // out-of-date lines the rep used, with the correct version
  transcript: string; // what was actually said; used to check figures, not sent to Claude
}

export interface PodWeek {
  pod: Pod;
  week_start: string; // Monday, YYYY-MM-DD
  calls: ScoredCall[];
  avg_overall: number | null;
  prior_avg_overall: number | null; // previous 4 weeks
  area_avgs: { area: string; label: string; avg: number; prior: number | null; n: number }[];
}

// Monday of last week, relative to `now` (UTC).
export function lastWeekStart(now = new Date()): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const daysSinceMonday = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - daysSinceMonday - 7);
  return d.toISOString().split('T')[0];
}

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split('T')[0];
}

const round1 = (n: number) => Math.round(n * 10) / 10;
const avg = (xs: number[]) => (xs.length ? round1(xs.reduce((a, b) => a + b, 0) / xs.length) : null);

export async function getPods(): Promise<Pod[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('sdrs').select('id, name, email, bd_name, bd_email').eq('is_active', true);
  if (error) throw new Error(`Failed to load pods: ${error.message}`);
  return (data || [])
    .filter((s) => s.email && s.bd_email)
    .map((s) => ({ sdr_id: s.id, pe_name: s.name, pe_email: s.email, gd_name: s.bd_name, gd_email: s.bd_email }));
}

type AnalysisRow = {
  analysis_date: string; overall_score: number; insight: string | null; key_moment: string | null;
  improvement: string | null; area_breakdown: ScoredCall['areas'] | null; flags: ClaimFlag[] | null;
  call_id: string; calls: { company: string | null } | null;
};

export async function getPodWeek(pod: Pod, weekStart: string): Promise<PodWeek> {
  const db = getSupabaseAdmin();
  const weekEnd = addDays(weekStart, 6);
  const priorStart = addDays(weekStart, -28);

  const { data, error } = await db.from('call_analyses')
    .select('analysis_date, overall_score, insight, key_moment, improvement, area_breakdown, flags, call_id, calls(company)')
    .eq('sdr_id', pod.sdr_id)
    .eq('rubric_version', RUBRIC_VERSION) // never compare scores from different rubrics
    .gte('analysis_date', priorStart).lte('analysis_date', weekEnd)
    .order('analysis_date', { ascending: true });
  if (error) throw new Error(`Failed to load analyses for ${pod.pe_name}: ${error.message}`);

  const rows = (data || []) as unknown as AnalysisRow[];
  const thisWeek = rows.filter((r) => r.analysis_date >= weekStart);
  const prior = rows.filter((r) => r.analysis_date < weekStart);

  // Transcripts are large and only needed for this week (to check figures).
  const transcripts = new Map<string, string>();
  if (thisWeek.length > 0) {
    const { data: tx, error: txError } = await db.from('calls').select('id, transcript')
      .in('id', thisWeek.map((r) => r.call_id));
    if (txError) throw new Error(`Failed to load transcripts for ${pod.pe_name}: ${txError.message}`);
    for (const t of tx || []) transcripts.set(t.id, t.transcript || '');
  }

  const areaScores = (rs: AnalysisRow[], area: string) =>
    rs.map((r) => r.area_breakdown?.[area]?.score).filter((s): s is number => typeof s === 'number');

  const area_avgs = Object.entries(BEAT_LABELS)
    .map(([area, label]) => {
      const scores = areaScores(thisWeek, area);
      return { area, label, avg: avg(scores) ?? NaN, prior: avg(areaScores(prior, area)), n: scores.length };
    })
    .filter((a) => a.n > 0)
    .sort((a, b) => a.avg - b.avg);

  return {
    pod,
    week_start: weekStart,
    calls: thisWeek.map((r) => ({
      company: r.calls?.company || 'Unknown company',
      date: r.analysis_date,
      overall: r.overall_score,
      insight: r.insight || '',
      key_moment: r.key_moment || '',
      improvement: r.improvement || '',
      areas: r.area_breakdown || {},
      claim_flags: r.flags || [],
      transcript: transcripts.get(r.call_id) || '',
    })),
    avg_overall: avg(thisWeek.map((r) => r.overall_score)),
    prior_avg_overall: avg(prior.map((r) => r.overall_score)),
    area_avgs,
  };
}

// Calls from the week that should have been scored but weren't, so the brief
// can say it's incomplete rather than silently under-report.
export async function unscoredCallsInWeek(weekStart: string): Promise<number> {
  const db = getSupabaseAdmin();
  const weekEnd = addDays(weekStart, 6);
  const { data: calls, error } = await db.from('calls').select('id')
    .gte('call_date', weekStart).lte('call_date', weekEnd)
    .ilike('disposition_label', 'Connected%').gte('duration_ms', 240_000)
    .not('recording_url', 'is', null).neq('recording_url', '');
  if (error) throw new Error(`Failed to check unscored calls: ${error.message}`);
  const ids = (calls || []).map((c) => c.id);
  if (ids.length === 0) return 0;
  // Scored under an older rubric counts as unscored: the brief leaves it out.
  const { data: done, error: doneError } = await db.from('call_analyses').select('call_id')
    .in('call_id', ids).eq('rubric_version', RUBRIC_VERSION);
  if (doneError) throw new Error(`Failed to check scored calls: ${doneError.message}`);
  return ids.length - (done || []).length;
}
