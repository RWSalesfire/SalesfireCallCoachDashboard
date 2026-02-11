import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { CallAnalysis, SDR } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function verifyCronSecret(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  if (auth === `Bearer ${process.env.CRON_SECRET}`) return true;
  const secret = request.nextUrl.searchParams.get('secret');
  return secret === process.env.CRON_SECRET;
}

const SKILL_AREAS = [
  'gatekeeper', 'opener', 'personalisation', 'discovery',
  'callControl', 'toneEnergy', 'valueProp', 'objections', 'close',
] as const;

const SCORE_COLUMNS: Record<string, string> = {
  gatekeeper: 'avg_gatekeeper',
  opener: 'avg_opener',
  personalisation: 'avg_personalisation',
  discovery: 'avg_discovery',
  callControl: 'avg_call_control',
  toneEnergy: 'avg_tone_energy',
  valueProp: 'avg_value_prop',
  objections: 'avg_objections',
  close: 'avg_close',
};

const ANALYSIS_SCORE_FIELDS: Record<string, keyof CallAnalysis> = {
  gatekeeper: 'gatekeeper_score',
  opener: 'opener_score',
  personalisation: 'personalisation_score',
  discovery: 'discovery_score',
  callControl: 'call_control_score',
  toneEnergy: 'tone_energy_score',
  valueProp: 'value_prop_score',
  objections: 'objections_score',
  close: 'close_score',
};

function avgNonNull(values: (number | null)[]): number | null {
  const valid = values.filter((v): v is number => v !== null && v !== undefined);
  if (valid.length === 0) return null;
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10;
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getWeekBounds(year: number, weekNum: number): { start: string; end: string } {
  // Find the Monday of the given ISO week
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1 + (weekNum - 1) * 7);
  const friday = new Date(monday);
  friday.setUTCDate(monday.getUTCDate() + 4);
  return {
    start: monday.toISOString().split('T')[0],
    end: friday.toISOString().split('T')[0],
  };
}

async function backfillWeeklySummaries() {
  const supabase = getSupabaseAdmin();

  const { data: sdrs, error: sdrError } = await supabase
    .from('sdrs')
    .select('*')
    .eq('is_active', true);

  if (sdrError || !sdrs || sdrs.length === 0) {
    throw new Error('No active SDRs found');
  }

  const now = new Date();
  const currentWeek = getISOWeekNumber(now);
  const year = now.getUTCFullYear();

  // Backfill last 6 weeks (covers 30+ days)
  const startWeek = Math.max(1, currentWeek - 5);
  const results: { sdr: string; weeks: { week: number; calls: number; success: boolean }[] }[] = [];

  for (const sdr of sdrs as SDR[]) {
    const weekResults: { week: number; calls: number; success: boolean }[] = [];

    for (let weekNum = startWeek; weekNum <= currentWeek; weekNum++) {
      const { start: weekStart, end: weekEnd } = getWeekBounds(year, weekNum);

      const { data: weekAnalyses } = await supabase
        .from('call_analyses')
        .select('*')
        .eq('sdr_id', sdr.id)
        .gte('analysis_date', weekStart)
        .lte('analysis_date', weekEnd);

      const wa = (weekAnalyses || []) as CallAnalysis[];

      if (wa.length === 0) {
        weekResults.push({ week: weekNum, calls: 0, success: false });
        continue;
      }

      const avgOverall = avgNonNull(wa.map((a) => a.overall_score));
      const demosBooked = wa.filter((a) => a.outcome === 'demo').length;

      const areaAvgs: Record<string, number | null> = {};
      for (const area of SKILL_AREAS) {
        const field = ANALYSIS_SCORE_FIELDS[area];
        areaAvgs[area] = avgNonNull(wa.map((a) => a[field] as number | null));
      }

      let weakestArea: string | null = null;
      let weakestScore: number | null = null;
      for (const [area, avg] of Object.entries(areaAvgs)) {
        if (avg !== null && (weakestScore === null || avg < weakestScore)) {
          weakestArea = area;
          weakestScore = avg;
        }
      }

      const weeklyPayload: Record<string, unknown> = {
        sdr_id: sdr.id,
        week_number: weekNum,
        year,
        week_start: weekStart,
        week_end: weekEnd,
        calls_reviewed: wa.length,
        demos_booked: demosBooked,
        avg_overall: avgOverall,
        focus_area_name: weakestArea,
        focus_area_score: weakestScore,
      };

      for (const area of SKILL_AREAS) {
        weeklyPayload[SCORE_COLUMNS[area]] = areaAvgs[area];
      }

      const { error: weeklyError } = await supabase
        .from('weekly_summaries')
        .upsert(weeklyPayload, { onConflict: 'sdr_id,week_number,year' });

      weekResults.push({ week: weekNum, calls: wa.length, success: !weeklyError });
    }

    results.push({ sdr: sdr.name, weeks: weekResults });
  }

  return { year, weeks: `${startWeek}-${currentWeek}`, sdrs: results };
}

export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await backfillWeeklySummaries();
    return NextResponse.json(result);
  } catch (err) {
    console.error('Backfill weekly error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
