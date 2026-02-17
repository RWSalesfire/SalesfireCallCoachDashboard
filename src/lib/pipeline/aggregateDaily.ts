import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { generateDailyFocus } from '@/lib/claude';
import { CallAnalysis, SDR } from '@/lib/supabase';

function getYesterday(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0];
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getWeekBounds(date: Date): { start: string; end: string } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - day + 1);
  const friday = new Date(monday);
  friday.setUTCDate(monday.getUTCDate() + 4);
  return {
    start: monday.toISOString().split('T')[0],
    end: friday.toISOString().split('T')[0],
  };
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

export interface AggregateResult {
  date: string;
  is_sunday: boolean;
  sdrs: { sdr: string; daily_stats: boolean; daily_focus: boolean; weekly: boolean }[];
}

export async function runAggregateDaily(): Promise<AggregateResult> {
  const supabase = getSupabaseAdmin();

  const yesterday = getYesterday();
  const yesterdayDate = new Date(yesterday + 'T00:00:00Z');
  const isSunday = yesterdayDate.getUTCDay() === 0;

  // Get all active SDRs
  const { data: sdrs, error: sdrError } = await supabase
    .from('sdrs')
    .select('*')
    .eq('is_active', true);

  if (sdrError || !sdrs || sdrs.length === 0) {
    throw new Error('No active SDRs found');
  }

  const sdrResults: { sdr: string; daily_stats: boolean; daily_focus: boolean; weekly: boolean }[] = [];

  for (const sdr of sdrs as SDR[]) {
    const result = { sdr: sdr.name, daily_stats: false, daily_focus: false, weekly: false };

    // ── Daily stats ──
    const { data: dayCalls } = await supabase
      .from('calls')
      .select('id, duration_ms, disposition, disposition_label, transcript')
      .eq('sdr_id', sdr.id)
      .eq('call_date', yesterday);

    const calls = dayCalls || [];
    const totalDials = calls.length;
    const connectedCalls = calls.filter((c) => (c.disposition_label || '').startsWith('Connected')).length;
    const connectionRate = totalDials > 0 ? Math.round((connectedCalls / totalDials) * 1000) / 10 : 0;
    const callsOver5min = calls.filter((c) => (c.duration_ms || 0) >= 300000).length;

    const { error: statsError } = await supabase
      .from('daily_stats')
      .upsert(
        {
          sdr_id: sdr.id,
          date: yesterday,
          total_dials: totalDials,
          connected_calls: connectedCalls,
          connection_rate: connectionRate,
          calls_over_5min: callsOver5min,
        },
        { onConflict: 'sdr_id,date' }
      );

    result.daily_stats = !statsError;

    // ── Daily focus ──
    const { data: analyses } = await supabase
      .from('call_analyses')
      .select('*')
      .eq('sdr_id', sdr.id)
      .eq('analysis_date', yesterday);

    if (analyses && analyses.length > 0) {
      try {
        const companies = await Promise.all(
          analyses.map(async (a: CallAnalysis) => {
            const { data: call } = await supabase
              .from('calls')
              .select('company')
              .eq('id', a.call_id)
              .single();
            return call?.company || 'Unknown';
          })
        );

        const focusResult = await generateDailyFocus(sdr.name, analyses, companies);

        const { error: focusError } = await supabase
          .from('daily_focus')
          .upsert(
            {
              sdr_id: sdr.id,
              date: yesterday,
              instruction: focusResult.instruction,
              based_on_calls: analyses.length,
              pattern_identified: focusResult.pattern_identified,
            },
            { onConflict: 'sdr_id,date' }
          );

        result.daily_focus = !focusError;
      } catch (err) {
        console.error(`Error generating focus for ${sdr.name}:`, err);
      }
    }

    // ── Weekly summary (on Sundays) ──
    if (isSunday) {
      const weekNum = getISOWeekNumber(yesterdayDate);
      const year = yesterdayDate.getUTCFullYear();
      const { start: weekStart, end: weekEnd } = getWeekBounds(yesterdayDate);

      const { data: weekAnalyses } = await supabase
        .from('call_analyses')
        .select('*')
        .eq('sdr_id', sdr.id)
        .gte('analysis_date', weekStart)
        .lte('analysis_date', weekEnd);

      const wa = (weekAnalyses || []) as CallAnalysis[];

      if (wa.length > 0) {
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

        result.weekly = !weeklyError;
      }
    }

    sdrResults.push(result);
  }

  return { date: yesterday, is_sunday: isSunday, sdrs: sdrResults };
}
