# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

- Hosted on Vercel Hobby plan — **cron jobs in vercel.json do NOT run** on Hobby
- GitHub Actions (`.github/workflows/pipeline-cron.yml`) triggers the pipeline 6x daily Mon-Fri (5am, 8am, 11am, 2pm, 5pm, 8pm UTC)
- Requires GitHub repo secrets: `PIPELINE_URL` (Vercel production URL) and `CRON_SECRET`
- Production URL: `salesfire-call-coach-dashboard.vercel.app`
- Vercel project/org IDs in `.vercel/project.json`
- Trigger manually: `gh workflow run "Trigger Daily Pipeline" --repo RWSalesfire/SalesfireCallCoachDashboard`

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
