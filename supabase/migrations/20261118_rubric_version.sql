-- Scoring rubric v2 (18 Nov 2026): calls are scored on the beats of a good
-- call instead of 9 generic skills. rubric_version says which rubric scored a
-- row, so briefs only compare like with like and old rows can be re-scored.
-- Existing rows are v1. The v2 beat scores live in area_breakdown; the old
-- per-skill columns stay null for v2 rows. `flags` (previously unused) holds
-- out-of-date claims a rep made, with the correct line.

alter table call_analyses add column if not exists rubric_version integer not null default 1;
create index if not exists call_analyses_rubric_version_idx on call_analyses (rubric_version, analysis_date);
