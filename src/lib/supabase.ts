import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client only if credentials are available
let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey;
};

// Database types based on our schema
export interface SDR {
  id: string;
  name: string;
  slug: string;
  email: string;
  hubspot_owner_id: number;
  bd_name: string;
  bd_email: string;
  bd_hubspot_owner_id: number;
  is_active: boolean;
  created_at: string;
}

export interface Call {
  id: string;
  hubspot_call_id: number;
  sdr_id: string;
  company: string | null;
  prospect_name: string | null;
  call_date: string;
  call_timestamp: string;
  duration_ms: number;
  duration_formatted: string | null;
  disposition: string | null;
  disposition_label: string | null;
  is_connected: boolean;
  has_transcript: boolean;
  recording_url: string | null;
  transcript: string | null;
  created_at: string;
}

export interface CallAnalysis {
  id: string;
  call_id: string;
  sdr_id: string;
  analysis_date: string;
  outcome: 'demo' | 'email' | 'not_interested' | 'warm_lead' | 'other' | null;
  overall_score: number | null;
  gatekeeper_score: number | null;
  opener_score: number | null;
  discovery_score: number | null;
  the_why_score: number | null;
  objections_score: number | null;
  close_score: number | null;
  insight: string | null;
  key_moment: string | null;
  improvement: string | null;
  talk_time_percent: number | null;
  talk_speed_wpm: number | null;
  longest_monologue_secs: number | null;
  created_at: string;
}

export interface DailyStats {
  id: string;
  sdr_id: string;
  date: string;
  total_dials: number;
  connected_calls: number;
  connection_rate: number;
  calls_over_5min: number;
  calls_analyzed: number;
  demos_booked: number;
  created_at: string;
}

export interface DailyFocus {
  id: string;
  sdr_id: string;
  date: string;
  instruction: string;
  based_on_calls: number | null;
  pattern_identified: string | null;
  created_at: string;
}

export interface WeeklySummary {
  id: string;
  sdr_id: string;
  year: number;
  week_number: number;
  week_start: string;
  week_end: string;
  calls_reviewed: number;
  demos_booked: number;
  demos_change: number | null;
  avg_overall: number | null;
  overall_change: number | null;
  avg_gatekeeper: number | null;
  avg_opener: number | null;
  avg_discovery: number | null;
  avg_the_why: number | null;
  avg_objections: number | null;
  avg_close: number | null;
  focus_area_name: string | null;
  focus_area_score: number | null;
  focus_area_change: number | null;
  week_focus_title: string | null;
  week_focus_triggers: string[] | null;
  week_focus_dont: string | null;
  week_focus_do: string | null;
  week_focus_example: { context: string; couldHaveSaid: string } | null;
  best_moment: string | null;
  created_at: string;
}

export interface MonthlyBenchmark {
  id: string;
  year: number;
  month: number;
  team_total_dials: number;
  team_total_connected: number;
  team_connection_rate: number;
  team_calls_analyzed: number;
  team_avg_overall_score: number | null;
  created_at: string;
}
