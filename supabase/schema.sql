-- Salesfire SDR Call Coaching Dashboard
-- Supabase Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: sdrs
-- Stores SDR information and BD pairings
-- ============================================
CREATE TABLE sdrs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    hubspot_owner_id INTEGER NOT NULL UNIQUE,
    bd_name TEXT NOT NULL,
    bd_email TEXT NOT NULL,
    bd_hubspot_owner_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick slug lookups
CREATE INDEX idx_sdrs_slug ON sdrs(slug);
CREATE INDEX idx_sdrs_hubspot_owner_id ON sdrs(hubspot_owner_id);

-- ============================================
-- Table: calls
-- Stores individual call records from HubSpot
-- ============================================
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hubspot_call_id TEXT NOT NULL UNIQUE,
    sdr_id UUID NOT NULL REFERENCES sdrs(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    prospect_name TEXT,
    call_date DATE NOT NULL,
    duration_seconds INTEGER NOT NULL,
    outcome TEXT CHECK (outcome IN ('demo', 'email', 'not_interested', 'warm_lead')),
    transcript TEXT,
    recording_url TEXT,
    hubspot_contact_id TEXT,
    hubspot_company_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_calls_sdr_id ON calls(sdr_id);
CREATE INDEX idx_calls_date ON calls(call_date);
CREATE INDEX idx_calls_sdr_date ON calls(sdr_id, call_date);

-- ============================================
-- Table: call_analyses
-- Stores Claude AI analysis for each call
-- ============================================
CREATE TABLE call_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_id UUID NOT NULL UNIQUE REFERENCES calls(id) ON DELETE CASCADE,

    -- Overall score
    overall_score DECIMAL(3, 1) CHECK (overall_score >= 0 AND overall_score <= 10),

    -- Individual skill scores (nullable for N/A)
    gatekeeper_score DECIMAL(3, 1) CHECK (gatekeeper_score IS NULL OR (gatekeeper_score >= 0 AND gatekeeper_score <= 10)),
    opener_score DECIMAL(3, 1) CHECK (opener_score >= 0 AND opener_score <= 10),
    personalisation_score DECIMAL(3, 1) CHECK (personalisation_score IS NULL OR (personalisation_score >= 0 AND personalisation_score <= 10)),
    discovery_score DECIMAL(3, 1) CHECK (discovery_score >= 0 AND discovery_score <= 10),
    call_control_score DECIMAL(3, 1) CHECK (call_control_score IS NULL OR (call_control_score >= 0 AND call_control_score <= 10)),
    tone_energy_score DECIMAL(3, 1) CHECK (tone_energy_score IS NULL OR (tone_energy_score >= 0 AND tone_energy_score <= 10)),
    value_prop_score DECIMAL(3, 1) CHECK (value_prop_score >= 0 AND value_prop_score <= 10),
    objections_score DECIMAL(3, 1) CHECK (objections_score IS NULL OR (objections_score >= 0 AND objections_score <= 10)),
    close_score DECIMAL(3, 1) CHECK (close_score >= 0 AND close_score <= 10),

    -- Qualitative feedback
    key_moment TEXT,
    improvement TEXT,
    insight TEXT,

    -- Call metrics
    talk_time_percent DECIMAL(4, 1),
    longest_monologue_seconds INTEGER,
    listening_time_seconds INTEGER,
    talk_speed_wpm INTEGER,

    -- Raw analysis JSON from Claude (for reference)
    raw_analysis JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for call lookups
CREATE INDEX idx_call_analyses_call_id ON call_analyses(call_id);

-- ============================================
-- Table: weekly_summaries
-- Aggregated weekly stats and focus areas
-- ============================================
CREATE TABLE weekly_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sdr_id UUID NOT NULL REFERENCES sdrs(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 53),
    year INTEGER NOT NULL,

    -- Stats
    calls_reviewed INTEGER DEFAULT 0,
    demos_booked INTEGER DEFAULT 0,
    total_dials INTEGER DEFAULT 0,
    total_connected INTEGER DEFAULT 0,

    -- Average scores
    avg_overall DECIMAL(3, 1),
    avg_gatekeeper DECIMAL(3, 1),
    avg_opener DECIMAL(3, 1),
    avg_personalisation DECIMAL(3, 1),
    avg_discovery DECIMAL(3, 1),
    avg_call_control DECIMAL(3, 1),
    avg_tone_energy DECIMAL(3, 1),
    avg_value_prop DECIMAL(3, 1),
    avg_objections DECIMAL(3, 1),
    avg_close DECIMAL(3, 1),

    -- Focus area
    focus_area TEXT,
    focus_area_score DECIMAL(3, 1),
    focus_instruction TEXT,

    -- Week focus details (JSON for flexibility)
    week_focus JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(sdr_id, week_number, year)
);

-- Indexes
CREATE INDEX idx_weekly_summaries_sdr_id ON weekly_summaries(sdr_id);
CREATE INDEX idx_weekly_summaries_week ON weekly_summaries(year, week_number);

-- ============================================
-- Table: daily_focus
-- Daily focus instructions for each SDR
-- ============================================
CREATE TABLE daily_focus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sdr_id UUID NOT NULL REFERENCES sdrs(id) ON DELETE CASCADE,
    focus_date DATE NOT NULL,
    instruction TEXT NOT NULL,
    generated_from_calls UUID[], -- Array of call IDs used to generate this focus
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(sdr_id, focus_date)
);

-- Index
CREATE INDEX idx_daily_focus_sdr_date ON daily_focus(sdr_id, focus_date);

-- ============================================
-- Table: daily_stats
-- Daily activity stats pulled from HubSpot
-- ============================================
CREATE TABLE daily_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sdr_id UUID NOT NULL REFERENCES sdrs(id) ON DELETE CASCADE,
    stat_date DATE NOT NULL,
    total_dials INTEGER DEFAULT 0,
    connected_calls INTEGER DEFAULT 0,
    connection_rate DECIMAL(4, 1),
    calls_over_5min INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(sdr_id, stat_date)
);

-- Index
CREATE INDEX idx_daily_stats_sdr_date ON daily_stats(sdr_id, stat_date);

-- ============================================
-- Insert initial SDR data
-- ============================================
INSERT INTO sdrs (name, slug, email, hubspot_owner_id, bd_name, bd_email, bd_hubspot_owner_id) VALUES
    ('Katie Simpson', 'katie', 'katie.simpson@salesfire.com', 79353482, 'Russell Westgarth', 'russell.westgarth@salesfire.com', 1545993649),
    ('Sally Watson', 'sally', 'sally.watson@salesfire.co.uk', 34452385, 'Charlie Butlin', 'charlie.butlin@salesfire.com', 189350186),
    ('Jack Skeldon', 'jack', 'jack.skeldon@salesfire.com', 192524366, 'Kev Gordon', 'kev.gordon@salesfire.com', 31438116),
    ('Stephanie McCarthy', 'steph', 'stephanie.mccarthy@salesfire.com', 91666198, 'Ashleigh Marr', 'ashleigh.marr@salesfire.com', 239334762);

-- ============================================
-- Views for common queries
-- ============================================

-- View: Recent calls with analysis
CREATE VIEW recent_calls_with_analysis AS
SELECT
    c.id,
    c.company,
    c.prospect_name,
    c.call_date,
    c.duration_seconds,
    c.outcome,
    s.name AS sdr_name,
    s.slug AS sdr_slug,
    a.overall_score,
    a.key_moment,
    a.improvement,
    a.insight
FROM calls c
JOIN sdrs s ON c.sdr_id = s.id
LEFT JOIN call_analyses a ON c.id = a.call_id
ORDER BY c.call_date DESC, c.created_at DESC;

-- View: SDR weekly performance
CREATE VIEW sdr_weekly_performance AS
SELECT
    s.name AS sdr_name,
    s.slug AS sdr_slug,
    w.year,
    w.week_number,
    w.calls_reviewed,
    w.demos_booked,
    w.avg_overall,
    w.focus_area,
    w.focus_area_score,
    LAG(w.avg_overall) OVER (PARTITION BY w.sdr_id ORDER BY w.year, w.week_number) AS prev_week_overall,
    LAG(w.demos_booked) OVER (PARTITION BY w.sdr_id ORDER BY w.year, w.week_number) AS prev_week_demos
FROM weekly_summaries w
JOIN sdrs s ON w.sdr_id = s.id
ORDER BY w.year DESC, w.week_number DESC;

-- ============================================
-- Functions
-- ============================================

-- Function to calculate connection rate
CREATE OR REPLACE FUNCTION calculate_connection_rate(dials INTEGER, connected INTEGER)
RETURNS DECIMAL(4, 1) AS $$
BEGIN
    IF dials = 0 THEN
        RETURN 0;
    END IF;
    RETURN ROUND((connected::DECIMAL / dials * 100)::DECIMAL, 1);
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_sdrs_updated_at
    BEFORE UPDATE ON sdrs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_summaries_updated_at
    BEFORE UPDATE ON weekly_summaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) Policies
-- Enable when authentication is set up
-- ============================================

-- ALTER TABLE sdrs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE call_analyses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE weekly_summaries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_focus ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Example RLS policy (uncomment when needed):
-- CREATE POLICY "SDRs can view their own data" ON calls
--     FOR SELECT
--     USING (sdr_id IN (SELECT id FROM sdrs WHERE email = auth.email()));
