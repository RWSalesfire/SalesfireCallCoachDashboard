# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Brief (kickoff 16 Nov 2026)

- **Problem:** the dashboard isn't used weekly. What's needed is coaching points to use in 1:1s, huddles and later training sessions. The pipeline has failed silently three times and missed most scheduled runs (GitHub drops them).
- **New shape:** keep the pipeline (HubSpot → Deepgram → Claude scoring). Replace the dashboard with a **weekly pod brief** emailed to both people in each pod (Russell/Katie, Ashleigh/Steph, Kev/Jack, Charlie/Tracy). Dashboard archived: not maintained, not deleted.
- **Done:** every Monday by 8am the brief arrives with every call from the past week scored, and Russell uses at least one point from it in a 1:1 or huddle every week for 4 weeks (to 14 Dec 2026). Usage is judged by feel, not tracked (Russell's choice, 18 Nov). Going live to pods is Russell's call once the Growth Directors and Tim approve.
- **Appetite:** one-off rebuild, built autonomously. Running cost: a 5-minute check, under half a day a week. Training sessions wait until the brief has proved itself.
- **Top risk:** free API credits (Anthropic, Deepgram) run out silently; nobody acts on the brief.
- **Dependencies:** scheduler, Vercel Hobby, Supabase free tier, HubSpot token, Deepgram free credit, Anthropic free credits, `sdrs` roster maintained by hand. None are paid.
- **Monitoring (all to Russell's Telegram, tested 16-18 Nov):** step and HubSpot errors; didn't run (healthchecks.io, nightly + briefs); zero calls on a working day (UK bank holidays skipped); backlog not cleared overnight; scoring sanity (a day's scores all identical or averaging outside 1.5-8.5); slow (>270s) or dead runs; credit errors URGENT on first failure plus a first-Tuesday monthly reminder to check Anthropic and Deepgram credit (neither balance is readable by API); Gmail grant checked nightly.
- **Learning goal:** why scheduled jobs are unreliable and how a "didn't run" alarm works.

## How it runs now (from 16 Nov 2026)

- **Scheduler:** Supabase pg_cron + pg_net (`supabase/migrations/20261116_schedule.sql`), calling Vercel with the `cron_secret` held in Supabase Vault. Check jobs with `select * from cron.job_run_details order by start_time desc limit 20;`.
- **`/api/cron/nightly`** (`src/lib/pipeline/runNightly.ts`): every 20 min 00:00-04:40 UTC Tue-Sat, plus `?final=1` at 04:55 for the end-of-night checks. Each run is logged in `pipeline_runs`.
- **`/api/cron/pod-briefs`** (`src/lib/briefs/`): Mondays 06:30 UTC, retry 06:50. Pods come from `sdrs` (PE `email` + GD `bd_email`). Sends are recorded in `pod_briefs`, so retries never double-send. **Review mode:** while the `BRIEF_REVIEW_TO` env var is set, every email goes only to that address. Remove it to go live.
- **Alerts:** Telegram via `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID`; dead man's switch via healthchecks.io (`HC_PIPELINE_URL`, `HC_BRIEF_URL`); email via the Gmail API with a **send-only** grant (`GMAIL_USER`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`). The grant is made by running `node scripts/gmail-auth.mjs` once, using the content engine's Google OAuth client. The end-of-night run checks the grant still works.
- **Scoring (rubric v2, from 18 Nov 2026):** `src/lib/scoring/`. Calls are scored on the beats of a good call (not script wording): earning the right, letting them talk ×2, explaining the problem ×2, proof that fits, easy to say yes, asking for the meeting ×2, plus gatekeeper and pushback when they happen. A meeting counts only with a day and time agreed on the call. Overall score is computed in code: half the result (booked 10, yes in principle 5, email 3, not interested 2) and half the craft (weighted beats, stored as `craft_score`), so a booked meeting lands about 6.5-7.5 (changed 19 Nov 2026 at Russell's request; v2 rows were recalculated in SQL, not re-scored). Approved facts and the 4 out-of-date claim types live in `facts.ts` (edit there when positioning changes). Model: Sonnet 5.5 (`src/lib/models.ts`). `call_analyses.rubric_version` marks which rubric scored a row; briefs only use the current one, and the nightly run re-scores older rows from the last 28 days when it has spare time.
- **Figures guard:** a % or £ figure in a brief must appear in a call transcript, or it's replaced with "[your proof point]". The per-call analyses invented figures before 16 Nov 2026.
- **Legacy:** the dashboard pages and the old step endpoints still exist but aren't maintained. Uncommitted "coaching modules" work in the tree (March-Oct 2026) was never deployed and needs the `utterance_timings` column, which doesn't exist.

## Project Overview

SDR Call Coaching Dashboard — a Next.js 14 app that displays daily and weekly coaching views for sales development representatives. Built with TypeScript, Tailwind CSS, Recharts, and Supabase (PostgreSQL). Deployed on Vercel.

## Commands

- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Production build
- `npm run lint` — ESLint with Next.js core-web-vitals rules
- No test framework is configured

## Architecture

**Routing (App Router):**
- `/` — Home/SDR selector
- `/[sdr]/[date]` — Daily view (e.g., `/katie/2026-02-03`)
- `/[sdr]/week/[week]` — Weekly view (e.g., `/katie/week/5`)
- Pages use ISR with `revalidate: 300` and `generateStaticParams` for common routes

**Data flow:**
1. Page components (server-side) call `getDashboardData(slug, date)` in `src/lib/data.ts`
2. `data.ts` checks if Supabase is configured → fetches from DB or falls back to `src/data/sampleData.ts`
3. Immutable `DashboardData` object is passed to `Dashboard` (client component)
4. `Dashboard` manages daily/weekly view toggle via `useState`, renders `DailyView` or `WeeklyView`

**Component organization:**
- `src/components/daily/` — Daily view components (call cards, focus banner)
- `src/components/weekly/` — Weekly view components (radar chart, progress, playbook)
- `src/components/ui/` — Shared UI primitives (StatCard, ScoreBadge, OutcomeBadge, ViewToggle)

**Supabase schema** (in `supabase/schema.sql`): `sdrs`, `calls`, `call_analyses`, `daily_stats`, `daily_focus`, `weekly_summaries`, `monthly_benchmarks`

## Data Pipeline

- 4-step daily pipeline: enrich (HubSpot) → transcribe (Deepgram) → analyze (Claude) → aggregate
- Pipeline endpoint: `/api/cron/daily-pipeline` — authenticates via `Authorization: Bearer <CRON_SECRET>` or `?secret=<CRON_SECRET>`
- Individual steps also exposed: `/api/cron/enrich-calls`, `/api/cron/transcribe-calls`, `/api/cron/analyze-calls`, `/api/cron/aggregate-daily`
- Backfill endpoint: `/api/cron/backfill-weekly` (regenerates last 6 weeks of weekly summaries)
- Pipeline processes yesterday's calls (aggregate date = previous day), not today's
- `maxDuration = 300` (5 min) on all cron routes

## Deployment & Cron

- Hosted on Vercel Hobby plan. **Cron jobs in vercel.json do NOT run** on Hobby; scheduling is Supabase pg_cron (see "How it runs now").
- GitHub Actions scheduling was removed on 16 Nov 2026 (it dropped most runs and auto-disabled after 60 days).
- Production URL: `salesfire-call-coach-dashboard.vercel.app`
- Vercel project/org IDs in `.vercel/project.json`
- Trigger manually (in Supabase SQL): `select call_coach_trigger('/api/cron/nightly');`
- Deploy only from git (push to main). The working tree holds undeployable WIP, so never `vercel --prod` from it; to pick up new env vars run `vercel redeploy <latest prod url> --target production`.

## Gotchas

- If dashboard shows old/sample data, check pipeline is running — `data.ts` silently falls back to `sampleData.ts` when no DB data exists for a date
- Sample data has hardcoded dates (late Jan / early Feb 2026) — always looks stale

## Key Conventions

- Path alias: `@/*` maps to `src/*`
- Salesfire brand colors defined in `tailwind.config.ts`: `sf-dark`, `sf-good`, `sf-focus`, `sf-alert`, `sf-card`, `sf-card-alt`, `sf-body`, `sf-secondary`, `sf-border`
- All types are in `src/types/index.ts`
- Supabase client and DB types are in `src/lib/supabase.ts`
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (see `.env.example`)
- Four sample SDRs: katie, sally, jack, steph — used when Supabase is not configured
