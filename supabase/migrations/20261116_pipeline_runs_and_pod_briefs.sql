-- Run log for the overnight pipeline and the Monday briefs. Lets each run spot
-- a previous run that died, and suppresses repeated alerts.
create table if not exists pipeline_runs (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('nightly', 'pod_briefs')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  ok boolean,
  summary jsonb,
  alerts text[]
);
create index if not exists pipeline_runs_kind_started on pipeline_runs (kind, started_at desc);

-- One row per email sent, so a retry never double-sends.
create table if not exists pod_briefs (
  id uuid primary key default gen_random_uuid(),
  week_start date not null,
  brief_key text not null,          -- 'pod:<sdr_id>' or 'team'
  mode text not null check (mode in ('review', 'live')),
  sent_to text[] not null,
  subject text,
  sent_at timestamptz not null default now(),
  unique (week_start, brief_key, mode)
);

-- Service role only (no policies): these are internal, not for the browser.
alter table pipeline_runs enable row level security;
alter table pod_briefs enable row level security;
