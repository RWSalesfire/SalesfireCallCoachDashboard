// The overnight pipeline: enrich → transcribe → analyse, then health checks.
//
// Supabase pg_cron calls /api/cron/nightly every 20 minutes overnight Tue-Sat
// (processing the previous working day), then once more with final=true for
// the end-of-night checks. Each run records itself in `pipeline_runs`, so
// later runs can spot a run that died, and repeated alerts are suppressed.

import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { runEnrichCalls } from './enrichCalls';
import { runTranscribeCalls } from './transcribeCalls';
import { runAnalyzeCalls } from './analyzeCalls';
import { isCreditError } from '@/lib/alerts';

const TIME_BUDGET_MS = 240_000; // Vercel kills the function at 300s
const SECS_PER_ANALYSIS = 75_000;
const MAX_ANALYSES = 3;
const SLOW_RUN_MS = 270_000;
const DEAD_RUN_AFTER_MS = 10 * 60_000;

export interface NightlyResult {
  run_id: string | null;
  steps: Record<string, { ok: boolean; ms: number; detail?: unknown; error?: string }>;
  backlog: Backlog;
  alerts: string[];
  stepFailed: boolean;
}

export interface Backlog {
  awaiting_transcription: number;
  awaiting_analysis: number;
}

export async function getBacklog(): Promise<Backlog> {
  const db = getSupabaseAdmin();
  const count = async (q: PromiseLike<{ count: number | null; error: { message: string } | null }>) => {
    const { count, error } = await q;
    if (error) throw new Error(`Backlog query failed: ${error.message}`);
    return count ?? 0;
  };
  const [awaitingTranscription, transcribed, analysed] = await Promise.all([
    count(db.from('calls').select('id', { count: 'exact', head: true })
      .eq('has_transcript', false).ilike('disposition_label', 'Connected%')
      .gte('duration_ms', 240_000).not('recording_url', 'is', null).neq('recording_url', '')),
    count(db.from('calls').select('id', { count: 'exact', head: true })
      .not('transcript', 'is', null).neq('transcript', '')),
    count(db.from('call_analyses').select('id', { count: 'exact', head: true })),
  ]);
  return {
    awaiting_transcription: awaitingTranscription,
    awaiting_analysis: Math.max(0, transcribed - analysed),
  };
}

function yesterdayUtc(): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d;
}

async function step<T>(
  result: NightlyResult,
  name: string,
  fn: () => Promise<T>,
): Promise<T | undefined> {
  const start = Date.now();
  try {
    const detail = await fn();
    result.steps[name] = { ok: true, ms: Date.now() - start, detail };
    return detail;
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    result.steps[name] = { ok: false, ms: Date.now() - start, error };
    result.stepFailed = true;
    result.alerts.push(isCreditError(error)
      ? `URGENT ${name}: out of API credit. ${error.slice(0, 200)}`
      : `${name} step failed: ${error.slice(0, 200)}`);
    return undefined;
  }
}

// Per-call failures are caught inside the steps and returned as results, which
// is how "credit balance too low" went unnoticed in Oct 2026. Surface them.
function perCallFailures(result: NightlyResult, name: string, rows: { success: boolean; error?: string }[]) {
  const failed = rows.filter((r) => !r.success);
  if (failed.length === 0) return;
  const credit = failed.find((r) => r.error && isCreditError(r.error));
  result.alerts.push(credit
    ? `URGENT ${name}: out of API credit. ${credit.error!.slice(0, 200)}`
    : `${name}: ${failed.length} call(s) failed. First error: ${(failed[0].error || 'unknown').slice(0, 200)}`);
}

export async function runNightly({ final }: { final: boolean }): Promise<NightlyResult> {
  const db = getSupabaseAdmin();
  const started = Date.now();
  const result: NightlyResult = {
    run_id: null, steps: {}, backlog: { awaiting_transcription: 0, awaiting_analysis: 0 }, alerts: [], stepFailed: false,
  };

  // A previous run that never finished means it crashed or hit the time limit.
  const { data: prev } = await db.from('pipeline_runs')
    .select('id, started_at, finished_at').eq('kind', 'nightly')
    .order('started_at', { ascending: false }).limit(1).maybeSingle();
  if (prev && !prev.finished_at && started - new Date(prev.started_at).getTime() > DEAD_RUN_AFTER_MS) {
    result.alerts.push(`the run started ${prev.started_at} never finished (crashed or timed out).`);
  }

  const { data: run } = await db.from('pipeline_runs').insert({ kind: 'nightly' }).select('id').single();
  result.run_id = run?.id ?? null;

  await step(result, 'enrich', () => runEnrichCalls());
  const transcribed = await step(result, 'transcribe', () => runTranscribeCalls());
  if (transcribed) perCallFailures(result, 'transcribe', transcribed.results);

  const remaining = TIME_BUDGET_MS - (Date.now() - started);
  const analyseLimit = Math.min(MAX_ANALYSES, Math.floor(remaining / SECS_PER_ANALYSIS));
  const analysed = await step(result, 'analyse', () => runAnalyzeCalls(analyseLimit));
  if (analysed) perCallFailures(result, 'analyse', analysed.results);

  result.backlog = (await step(result, 'backlog', getBacklog)) ?? result.backlog;

  const duration = Date.now() - started;
  if (duration > SLOW_RUN_MS) {
    result.alerts.push(`slow run: ${Math.round(duration / 1000)}s, close to the 300s limit.`);
  }

  if (final) {
    const waiting = result.backlog.awaiting_transcription + result.backlog.awaiting_analysis;
    if (waiting > 0) {
      result.alerts.push(`backlog not cleared overnight: ${result.backlog.awaiting_transcription} awaiting transcription, ${result.backlog.awaiting_analysis} awaiting analysis.`);
    }
    // Yesterday was a working day (runs are Tue-Sat), so zero calls means
    // HubSpot enrichment is broken, not that nobody called.
    const day = yesterdayUtc().toISOString().split('T')[0];
    const { count } = await db.from('calls').select('id', { count: 'exact', head: true }).eq('call_date', day);
    if (!count) result.alerts.push(`no calls at all recorded for ${day}. Check HubSpot enrichment (or was it a bank holiday?).`);
  }

  if (run) {
    await db.from('pipeline_runs').update({
      finished_at: new Date().toISOString(),
      ok: !result.stepFailed,
      summary: { steps: result.steps, backlog: result.backlog, duration_ms: duration, final },
      alerts: result.alerts,
    }).eq('id', run.id);
  }

  return result;
}

// Drop alerts already sent in the last 6 hours, so a persistent problem
// (e.g. no credit) pings once, not every 20 minutes all night.
export async function freshAlerts(alerts: string[], excludeRunId: string | null): Promise<string[]> {
  if (alerts.length === 0) return alerts;
  const since = new Date(Date.now() - 6 * 3600_000).toISOString();
  let q = getSupabaseAdmin().from('pipeline_runs').select('alerts').gte('started_at', since);
  if (excludeRunId) q = q.neq('id', excludeRunId);
  const { data } = await q;
  const sent = new Set((data || []).flatMap((r: { alerts: string[] | null }) => r.alerts || []));
  return alerts.filter((a) => !sent.has(a));
}
