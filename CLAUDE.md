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

## Key Conventions

- Path alias: `@/*` maps to `src/*`
- Salesfire brand colors defined in `tailwind.config.ts`: `sf-dark`, `sf-good`, `sf-focus`, `sf-alert`, `sf-card`, `sf-card-alt`, `sf-body`, `sf-secondary`, `sf-border`
- All types are in `src/types/index.ts`
- Supabase client and DB types are in `src/lib/supabase.ts`
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (see `.env.example`)
- Four sample SDRs: katie, sally, jack, steph — used when Supabase is not configured
