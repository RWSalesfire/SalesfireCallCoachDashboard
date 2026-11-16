-- Scheduler: Supabase pg_cron calls the Vercel endpoints (replaces GitHub
-- Actions, which dropped most scheduled runs and auto-disables after 60 days).
-- Times are UTC. The cron secret lives in Supabase Vault as 'cron_secret',
-- created separately so it never sits in git:
--   select vault.create_secret('<CRON_SECRET>', 'cron_secret');

create extension if not exists pg_cron;
create extension if not exists pg_net;

create or replace function call_coach_trigger(path text) returns void
language sql security definer set search_path = public, extensions as $$
  select net.http_post(
    url := 'https://salesfire-call-coach-dashboard.vercel.app' || path,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 300000
  );
$$;
revoke execute on function call_coach_trigger(text) from public, anon, authenticated;

-- Overnight Tue-Sat, processing the previous working day: every 20 minutes
-- 00:00-04:40, then the end-of-night checks at 04:55.
select cron.schedule('call-coach-nightly', '*/20 0-4 * * 2-6', $$select call_coach_trigger('/api/cron/nightly')$$);
select cron.schedule('call-coach-nightly-final', '55 4 * * 2-6', $$select call_coach_trigger('/api/cron/nightly?final=1')$$);

-- Monday briefs at 06:30 UTC, retry at 06:50 (sends only what's missing).
select cron.schedule('call-coach-pod-briefs', '30 6 * * 1', $$select call_coach_trigger('/api/cron/pod-briefs')$$);
select cron.schedule('call-coach-pod-briefs-retry', '50 6 * * 1', $$select call_coach_trigger('/api/cron/pod-briefs')$$);
