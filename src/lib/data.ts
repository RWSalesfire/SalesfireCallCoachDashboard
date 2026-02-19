import { getSupabase, isSupabaseConfigured, SDR, DailyStats, DailyFocus, CallAnalysis, WeeklySummary, MonthlyBenchmark } from './supabase';
import { DashboardData, Call as DashboardCall, RadarScores } from '@/types';
import { getSampleDataForSDR, playbook } from '@/data/sampleData';

// ISO 8601 week number (matches aggregation pipeline)
function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// Get Mon-Fri bounds for the week containing the given date
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

// Get SDR by slug
export async function getSDRBySlug(slug: string): Promise<SDR | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('sdrs')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data;
}

// Get all active SDRs
export async function getAllSDRs(): Promise<SDR[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('sdrs')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error || !data) return [];
  return data;
}

// Get daily stats for an SDR on a specific date
export async function getDailyStats(sdrId: string, date: string): Promise<DailyStats | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('sdr_id', sdrId)
    .eq('date', date)
    .single();

  if (error || !data) return null;
  return data;
}

// Get daily focus for an SDR on a specific date
export async function getDailyFocus(sdrId: string, date: string): Promise<DailyFocus | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('daily_focus')
    .select('*')
    .eq('sdr_id', sdrId)
    .eq('date', date)
    .single();

  if (error || !data) return null;
  return data;
}

// Get team benchmark for a specific month
export async function getMonthlyBenchmark(year: number, month: number): Promise<MonthlyBenchmark | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('monthly_benchmarks')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .single();

  if (error || !data) return null;
  return data;
}

// Get calls with analyses for a specific date
export async function getCallsForDate(sdrId: string, date: string): Promise<(CallAnalysis & { call: { company: string; prospect_name: string; duration_formatted: string } })[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('call_analyses')
    .select(`
      *,
      call:calls!inner(company, prospect_name, duration_formatted, call_date)
    `)
    .eq('sdr_id', sdrId)
    .eq('analysis_date', date)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as any;
}

// Get weekly summary
export async function getWeeklySummary(sdrId: string, year: number, weekNumber: number): Promise<WeeklySummary | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('weekly_summaries')
    .select('*')
    .eq('sdr_id', sdrId)
    .eq('year', year)
    .eq('week_number', weekNumber)
    .single();

  if (error || !data) return null;
  return data;
}

// Get calls for a week
export async function getCallsForWeek(sdrId: string, weekStart: string, weekEnd: string): Promise<(CallAnalysis & { call: { company: string; prospect_name: string; duration_formatted: string; call_date: string } })[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('call_analyses')
    .select(`
      *,
      call:calls!inner(company, prospect_name, duration_formatted, call_date)
    `)
    .eq('sdr_id', sdrId)
    .gte('analysis_date', weekStart)
    .lte('analysis_date', weekEnd)
    .order('analysis_date', { ascending: false });

  if (error || !data) return [];
  return data as any;
}

// Get progress data (last 4 weeks)
export async function getProgressData(sdrId: string, currentYear: number, currentWeek: number): Promise<WeeklySummary[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('weekly_summaries')
    .select('*')
    .eq('sdr_id', sdrId)
    .lte('week_number', currentWeek)
    .gte('week_number', currentWeek - 3)
    .eq('year', currentYear)
    .order('week_number', { ascending: true });

  if (error || !data) return [];
  return data;
}

// Map score fields to area breakdown keys and labels (used to fill missing breakdowns at read time)
const SCORE_FIELD_MAP: { dbField: keyof CallAnalysis; areaKey: string; label: string }[] = [
  { dbField: 'gatekeeper_score', areaKey: 'gatekeeper', label: 'Gatekeeper' },
  { dbField: 'opener_score', areaKey: 'opener', label: 'Opener' },
  { dbField: 'personalisation_score', areaKey: 'personalisation', label: 'Personalisation' },
  { dbField: 'discovery_score', areaKey: 'discovery', label: 'Discovery' },
  { dbField: 'call_control_score', areaKey: 'callControl', label: 'Call Control' },
  { dbField: 'tone_energy_score', areaKey: 'toneEnergy', label: 'Tone & Energy' },
  { dbField: 'value_prop_score', areaKey: 'valueProp', label: 'Value Prop' },
  { dbField: 'objections_score', areaKey: 'objections', label: 'Objections' },
  { dbField: 'close_score', areaKey: 'close', label: 'Close' },
];

// Helper to convert DB call analysis to dashboard format
function convertCallAnalysis(analysis: CallAnalysis & { call: { company: string; prospect_name: string; duration_formatted: string; call_date?: string } }): DashboardCall {
  // Build area breakdown, filling in any scored areas that are missing from the stored breakdown
  const rawBreakdown = analysis.area_breakdown || {};
  const breakdown: Record<string, { score: number; why: string; well: string; improve: string; tryNext: string }> = {};

  for (const [key, val] of Object.entries(rawBreakdown)) {
    breakdown[key] = { score: val.score, why: val.why, well: val.well, improve: val.improve, tryNext: val.try_next };
  }

  // Ensure every scored area has a breakdown entry (catches older calls missing some areas)
  for (const { dbField, areaKey, label } of SCORE_FIELD_MAP) {
    const scoreValue = analysis[dbField];
    if (typeof scoreValue === 'number' && !(areaKey in breakdown)) {
      breakdown[areaKey] = {
        score: scoreValue,
        why: `${label} was scored ${scoreValue}/10.`,
        well: 'Analysis pending for this area.',
        improve: 'Analysis pending for this area.',
        tryNext: `Focus on improving ${label} in your next calls.`,
      };
    }
  }

  const hasBreakdown = Object.keys(breakdown).length > 0;

  return {
    id: analysis.id,
    company: analysis.call.company || 'Unknown Company',
    prospect: analysis.call.prospect_name || 'Unknown',
    date: analysis.call.call_date || analysis.analysis_date,
    duration: analysis.call.duration_formatted || '0:00',
    outcome: (analysis.outcome as any) || 'other',
    overall: analysis.overall_score || 0,
    insight: analysis.insight || '',
    scores: {
      gatekeeper: analysis.gatekeeper_score ?? 'N/A',
      opener: analysis.opener_score || 0,
      personalisation: analysis.personalisation_score ?? 'N/A',
      discovery: analysis.discovery_score || 0,
      callControl: analysis.call_control_score ?? 'N/A',
      toneEnergy: analysis.tone_energy_score ?? 'N/A',
      valueProp: analysis.value_prop_score || 0,
      objections: analysis.objections_score ?? 'N/A',
      close: analysis.close_score || 0,
    },
    metrics: (analysis.talk_time_percent != null || analysis.talk_speed_wpm != null) ? {
      talkTime: analysis.talk_time_percent || 0,
      talkSpeed: analysis.talk_speed_wpm || 0,
      monologue: analysis.longest_monologue_secs ?? undefined,
      customerStory: analysis.customer_story_secs ?? undefined,
      patience: analysis.patience_secs ?? undefined,
    } : undefined,
    areaBreakdown: hasBreakdown ? breakdown : undefined,
    keyMoment: analysis.key_moment || undefined,
    improvement: analysis.improvement || undefined,
  };
}

// Get calls for the last 30 days
export async function getCallsForLast30Days(sdrId: string, fromDate: string): Promise<(CallAnalysis & { call: { company: string; prospect_name: string; duration_formatted: string; call_date: string } })[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('call_analyses')
    .select(`
      *,
      call:calls!inner(company, prospect_name, duration_formatted, call_date)
    `)
    .eq('sdr_id', sdrId)
    .gte('analysis_date', fromDate)
    .order('analysis_date', { ascending: false });

  if (error || !data) return [];
  return data as any;
}

// Get calls older than 30 days (library/archive)
export async function getLibraryCalls(sdrId: string, beforeDate: string): Promise<(CallAnalysis & { call: { company: string; prospect_name: string; duration_formatted: string; call_date: string } })[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('call_analyses')
    .select(`
      *,
      call:calls!inner(company, prospect_name, duration_formatted, call_date)
    `)
    .eq('sdr_id', sdrId)
    .lt('analysis_date', beforeDate)
    .order('analysis_date', { ascending: false });

  if (error || !data) return [];
  return data as any;
}

// Compute all-time radar scores by averaging across all call analyses
function computeRadarScoresFromAnalyses(analyses: CallAnalysis[]): RadarScores {
  const fields = [
    ['gatekeeper_score', 'gatekeeper'],
    ['opener_score', 'opener'],
    ['personalisation_score', 'personalisation'],
    ['discovery_score', 'discovery'],
    ['call_control_score', 'callControl'],
    ['tone_energy_score', 'toneEnergy'],
    ['value_prop_score', 'valueProp'],
    ['objections_score', 'objections'],
    ['close_score', 'close'],
  ] as const;

  const result: Record<string, number> = {};
  for (const [dbField, radarKey] of fields) {
    const values = analyses.map(a => a[dbField]).filter((v): v is number => v != null && v > 0);
    result[radarKey] = values.length > 0
      ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 10) / 10
      : 0;
  }
  return result as unknown as RadarScores;
}

// Main function to get dashboard data
export async function getDashboardData(slug: string, date: string): Promise<DashboardData | null> {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, using sample data');
    return getSampleDataForSDR(slug, date);
  }

  try {
    // Get SDR
    const sdr = await getSDRBySlug(slug);
    if (!sdr) {
      // Fall back to sample data if SDR not found
      return getSampleDataForSDR(slug, date);
    }

    // Parse date
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;

    // Get daily data
    const [dailyStats, dailyFocus, benchmark, callsData] = await Promise.all([
      getDailyStats(sdr.id, date),
      getDailyFocus(sdr.id, date),
      getMonthlyBenchmark(year, month),
      getCallsForDate(sdr.id, date),
    ]);

    // Calculate ISO week number (matches aggregation pipeline)
    const weekNumber = getISOWeekNumber(dateObj);

    // Get weekly data
    const weeklySummary = await getWeeklySummary(sdr.id, year, weekNumber);
    const progressData = await getProgressData(sdr.id, year, weekNumber);

    // Get week boundaries for calls - compute from date so we always get Mon-Fri
    const { start: computedWeekStart, end: computedWeekEnd } = getWeekBounds(dateObj);
    const weekStart = weeklySummary?.week_start || computedWeekStart;
    const weekEnd = weeklySummary?.week_end || computedWeekEnd;
    const weeklyCalls = await getCallsForWeek(sdr.id, weekStart, weekEnd);

    // Get last 30 days data
    const thirtyDaysAgo = new Date(dateObj);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    const last30DaysCalls = await getCallsForLast30Days(sdr.id, thirtyDaysAgoStr);

    // Get library calls (older than 30 days)
    const libraryCalls = await getLibraryCalls(sdr.id, thirtyDaysAgoStr);

    // Compute all-time radar scores from all calls (last 30 days + library)
    const allCalls = [...last30DaysCalls, ...libraryCalls];
    const allTimeRadarScores = computeRadarScoresFromAnalyses(allCalls);

    // Check if we have any real data
    const hasRealData = dailyStats || dailyFocus || callsData.length > 0 || weeklySummary;

    if (!hasRealData) {
      // Fall back to sample data if no real data exists
      console.log('No real data found for', slug, date, '- using sample data');
      return getSampleDataForSDR(slug, date);
    }

    // Build dashboard data from real data
    const dashboardData: DashboardData = {
      sdrName: sdr.name,
      sdrSlug: sdr.slug,
      date: date,
      currentView: 'daily',
      teamAvgConnectionRate: benchmark?.team_connection_rate || 12.7,
      dailyStats: {
        totalDials: dailyStats?.total_dials || 0,
        connectedCalls: dailyStats?.connected_calls || 0,
        connectionRate: dailyStats?.connection_rate || 0,
      },
      focusToday: {
        instruction: dailyFocus?.instruction || 'No focus instruction for today. Check back after calls are analyzed.',
      },
      yesterdaysCalls: callsData.map(convertCallAnalysis),
      weeklyData: {
        weekNumber: weekNumber,
        callsReviewed: weeklySummary?.calls_reviewed || weeklyCalls.length,
        demosBooked: weeklySummary?.demos_booked || 0,
        demoChange: weeklySummary?.demos_change || 0,
        avgOverall: weeklySummary?.avg_overall || 0,
        overallChange: weeklySummary?.overall_change || 0,
        avgFocusArea: weeklySummary?.focus_area_score || 0,
        focusAreaChange: weeklySummary?.focus_area_change || 0,
        focusAreaName: weeklySummary?.focus_area_name || 'Value Prop',
        calls: weeklyCalls.map(convertCallAnalysis),
        radarScores: {
          gatekeeper: weeklySummary?.avg_gatekeeper || 0,
          opener: weeklySummary?.avg_opener || 0,
          personalisation: weeklySummary?.avg_personalisation || 0,
          discovery: weeklySummary?.avg_discovery || 0,
          callControl: weeklySummary?.avg_call_control || 0,
          toneEnergy: weeklySummary?.avg_tone_energy || 0,
          valueProp: weeklySummary?.avg_value_prop || 0,
          objections: weeklySummary?.avg_objections || 0,
          close: weeklySummary?.avg_close || 0,
        },
        progressData: progressData.map((w) => ({
          week: w.week_number,
          overall: w.avg_overall || 0,
          focusArea: w.focus_area_score || 0,
          close: w.avg_close || 0,
        })),
        weekFocus: {
          title: weeklySummary?.week_focus_title || 'Focus area to be determined',
          triggers: weeklySummary?.week_focus_triggers || [],
          dont: weeklySummary?.week_focus_dont || '',
          do: weeklySummary?.week_focus_do || '',
          example: weeklySummary?.week_focus_example || {
            context: '',
            couldHaveSaid: '',
          },
        },
      },
      last30DaysData: {
        callsReviewed: last30DaysCalls.length,
        demosBooked: last30DaysCalls.filter(c => c.outcome === 'demo').length,
        avgOverall: last30DaysCalls.length > 0
          ? Math.round((last30DaysCalls.reduce((sum, c) => sum + (c.overall_score || 0), 0) / last30DaysCalls.length) * 10) / 10
          : 0,
        calls: last30DaysCalls.map(convertCallAnalysis),
      },
      libraryData: {
        callsReviewed: libraryCalls.length,
        demosBooked: libraryCalls.filter(c => c.outcome === 'demo').length,
        avgOverall: libraryCalls.length > 0
          ? Math.round((libraryCalls.reduce((sum, c) => sum + (c.overall_score || 0), 0) / libraryCalls.length) * 10) / 10
          : 0,
        calls: libraryCalls.map(convertCallAnalysis),
      },
      allTimeRadarScores,
      playbook: playbook,
    };

    return dashboardData;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Fall back to sample data on error
    return getSampleDataForSDR(slug, date);
  }
}
