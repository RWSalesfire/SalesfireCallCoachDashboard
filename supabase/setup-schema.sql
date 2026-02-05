-- =====================================================
-- SDR Call Coaching System - Supabase Schema Setup
-- Run this entire script in the Supabase SQL Editor
-- =====================================================

-- =====================================================
-- TABLE 1: sdrs
-- SDR profiles with their paired BD information
-- =====================================================
CREATE TABLE sdrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  hubspot_owner_id BIGINT NOT NULL UNIQUE,
  bd_name TEXT NOT NULL,
  bd_email TEXT NOT NULL,
  bd_hubspot_owner_id BIGINT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for lookups by slug (used in URLs)
CREATE INDEX idx_sdrs_slug ON sdrs(slug);

COMMENT ON TABLE sdrs IS 'SDR profiles and BD pairings. Retention: Forever.';

-- Insert initial SDR data
INSERT INTO sdrs (name, slug, email, hubspot_owner_id, bd_name, bd_email, bd_hubspot_owner_id) VALUES
  ('Katie Simpson', 'katie', 'katie.simpson@salesfire.com', 79353482, 'Russell Westgarth', 'russell.westgarth@salesfire.com', 1545993649),
  ('Sally Watson', 'sally', 'sally.watson@salesfire.co.uk', 34452385, 'Charlie Butlin', 'charlie.butlin@salesfire.com', 189350186),
  ('Jack Skeldon', 'jack', 'jack.skeldon@salesfire.com', 192524366, 'Kev Gordon', 'kev.gordon@salesfire.com', 31438116),
  ('Stephanie McCarthy', 'steph', 'stephanie.mccarthy@salesfire.com', 91666198, 'Ashleigh Marr', 'ashleigh.marr@salesfire.com', 239334762);

-- =====================================================
-- TABLE 2: monthly_benchmarks
-- Team-level monthly averages for comparison
-- =====================================================
CREATE TABLE monthly_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  team_total_dials INTEGER NOT NULL,
  team_total_connected INTEGER NOT NULL,
  team_connection_rate DECIMAL(5,2) NOT NULL,
  team_calls_analyzed INTEGER NOT NULL,
  team_avg_overall_score DECIMAL(3,1),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(year, month)
);

COMMENT ON TABLE monthly_benchmarks IS 'Team-level monthly benchmarks. Retention: Forever.';

-- Insert January 2026 baseline
INSERT INTO monthly_benchmarks (year, month, team_total_dials, team_total_connected, team_connection_rate, team_calls_analyzed) VALUES
  (2026, 1, 3749, 477, 12.7, 59);

-- =====================================================
-- TABLE 3: calls
-- Raw call data imported from HubSpot
-- =====================================================
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hubspot_call_id BIGINT NOT NULL UNIQUE,
  sdr_id UUID NOT NULL REFERENCES sdrs(id),
  company TEXT,
  prospect_name TEXT,
  call_date DATE NOT NULL,
  call_timestamp TIMESTAMPTZ NOT NULL,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  duration_formatted TEXT,
  disposition TEXT,
  disposition_label TEXT,
  is_connected BOOLEAN DEFAULT false,
  has_transcript BOOLEAN DEFAULT false,
  recording_url TEXT,
  hubspot_notes TEXT,
  hubspot_summary TEXT,
  transcript TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for daily queries (most common access pattern)
CREATE INDEX idx_calls_sdr_date ON calls(sdr_id, call_date);

-- Index for finding analyzable calls
CREATE INDEX idx_calls_connected_duration ON calls(is_connected, duration_ms) WHERE is_connected = true;

-- Index for HubSpot ID lookups (deduplication)
CREATE INDEX idx_calls_hubspot_id ON calls(hubspot_call_id);

COMMENT ON TABLE calls IS 'Raw call data from HubSpot. Retention: 3 months (transcripts are large).';

-- =====================================================
-- TABLE 4: call_analyses
-- Claude-generated analysis for each qualifying call
-- =====================================================
CREATE TABLE call_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL UNIQUE REFERENCES calls(id),
  sdr_id UUID NOT NULL REFERENCES sdrs(id),
  analysis_date DATE NOT NULL,
  outcome TEXT CHECK (outcome IN ('demo', 'email', 'not_interested', 'warm_lead', 'other')),
  overall_score DECIMAL(3,1),
  gatekeeper_score DECIMAL(3,1),
  opener_score DECIMAL(3,1),
  personalisation_score DECIMAL(3,1),
  discovery_score DECIMAL(3,1),
  call_control_score DECIMAL(3,1),
  tone_energy_score DECIMAL(3,1),
  value_prop_score DECIMAL(3,1),
  objections_score DECIMAL(3,1),
  close_score DECIMAL(3,1),
  insight TEXT,
  key_moment TEXT,
  improvement TEXT,
  talk_time_percent DECIMAL(4,1),
  talk_speed_wpm INTEGER,
  longest_monologue_secs INTEGER,
  flags JSONB,
  raw_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for weekly queries
CREATE INDEX idx_call_analyses_sdr_date ON call_analyses(sdr_id, analysis_date);

COMMENT ON TABLE call_analyses IS 'Claude-generated call analysis. Retention: 6 months.';

-- =====================================================
-- TABLE 5: daily_stats
-- Pre-calculated daily statistics for fast dashboard loading
-- =====================================================
CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sdr_id UUID NOT NULL REFERENCES sdrs(id),
  date DATE NOT NULL,
  total_dials INTEGER NOT NULL DEFAULT 0,
  connected_calls INTEGER NOT NULL DEFAULT 0,
  connection_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  calls_over_5min INTEGER NOT NULL DEFAULT 0,
  calls_analyzed INTEGER NOT NULL DEFAULT 0,
  demos_booked INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(sdr_id, date)
);

-- Index for lookups
CREATE INDEX idx_daily_stats_sdr_date ON daily_stats(sdr_id, date);

COMMENT ON TABLE daily_stats IS 'Pre-calculated daily stats. Retention: 12 months.';

-- =====================================================
-- TABLE 6: daily_focus
-- AI-generated daily focus instruction per SDR
-- =====================================================
CREATE TABLE daily_focus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sdr_id UUID NOT NULL REFERENCES sdrs(id),
  date DATE NOT NULL,
  instruction TEXT NOT NULL,
  based_on_calls INTEGER,
  pattern_identified TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(sdr_id, date)
);

-- Index for lookups
CREATE INDEX idx_daily_focus_sdr_date ON daily_focus(sdr_id, date);

COMMENT ON TABLE daily_focus IS 'AI-generated daily focus. Retention: 6 months.';

-- =====================================================
-- TABLE 7: weekly_summaries
-- Aggregated weekly data for coaching 1:1s
-- =====================================================
CREATE TABLE weekly_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sdr_id UUID NOT NULL REFERENCES sdrs(id),
  year INTEGER NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 53),
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  calls_reviewed INTEGER NOT NULL DEFAULT 0,
  demos_booked INTEGER NOT NULL DEFAULT 0,
  demos_change INTEGER DEFAULT 0,
  avg_overall DECIMAL(3,1),
  overall_change DECIMAL(3,1),
  avg_gatekeeper DECIMAL(3,1),
  avg_opener DECIMAL(3,1),
  avg_personalisation DECIMAL(3,1),
  avg_discovery DECIMAL(3,1),
  avg_call_control DECIMAL(3,1),
  avg_tone_energy DECIMAL(3,1),
  avg_value_prop DECIMAL(3,1),
  avg_objections DECIMAL(3,1),
  avg_close DECIMAL(3,1),
  focus_area_name TEXT,
  focus_area_score DECIMAL(3,1),
  focus_area_change DECIMAL(3,1),
  week_focus_title TEXT,
  week_focus_triggers TEXT[],
  week_focus_dont TEXT,
  week_focus_do TEXT,
  week_focus_example JSONB,
  best_moment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(sdr_id, year, week_number)
);

-- Index for queries
CREATE INDEX idx_weekly_summaries_sdr_year_week ON weekly_summaries(sdr_id, year, week_number);

COMMENT ON TABLE weekly_summaries IS 'Weekly aggregated summaries. Retention: Forever.';

-- =====================================================
-- HELPER FUNCTION: Update Timestamp Trigger
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_calls_updated_at
  BEFORE UPDATE ON calls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICATION QUERIES
-- Run these after setup to confirm everything worked
-- =====================================================

-- Check all tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check SDRs were inserted
SELECT name, slug, hubspot_owner_id, bd_name FROM sdrs;

-- Check January benchmark
SELECT * FROM monthly_benchmarks WHERE year = 2026 AND month = 1;

-- Check indexes exist
SELECT indexname, tablename FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
