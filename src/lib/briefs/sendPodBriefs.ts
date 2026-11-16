// Monday job: one coaching email per pod, plus a huddle theme email to Russell.
//
// Idempotent: each sent email is recorded in `pod_briefs`, so a retry run
// only sends what's missing. While BRIEF_REVIEW_TO is set, every email goes
// to that address only (review mode) instead of to the pods.

import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { sendEmail } from '@/lib/email';
import { getPods, getPodWeek, lastWeekStart, unscoredCallsInWeek, PodWeek } from './podBriefData';
import { writePodBrief, writeTeamTheme } from './podBriefPrompt';
import { renderPodEmail, renderTeamEmail } from './podBriefEmail';

const MIN_CALLS_FOR_BRIEF = 1;

export interface SendBriefsResult {
  week_start: string;
  mode: 'review' | 'live';
  sent: string[];
  skipped: string[];
  failed: string[];
  alerts: string[];
}

export async function sendPodBriefs(now = new Date()): Promise<SendBriefsResult> {
  const db = getSupabaseAdmin();
  const weekStart = lastWeekStart(now);
  const reviewTo = process.env.BRIEF_REVIEW_TO;
  const mode = reviewTo ? 'review' : 'live';
  const teamTo = process.env.BRIEF_TEAM_TO || process.env.GMAIL_USER;
  const result: SendBriefsResult = { week_start: weekStart, mode, sent: [], skipped: [], failed: [], alerts: [] };

  const { data: already } = await db.from('pod_briefs').select('brief_key')
    .eq('week_start', weekStart).eq('mode', mode);
  const done = new Set((already || []).map((r) => r.brief_key));

  const send = async (key: string, to: string[], email: { subject: string; html: string; text: string }) => {
    const recipients = reviewTo ? [reviewTo] : to;
    const subject = reviewTo ? `[Review] ${email.subject}` : email.subject;
    await sendEmail({ ...email, to: recipients, subject });
    await db.from('pod_briefs').insert({ week_start: weekStart, brief_key: key, mode, sent_to: recipients, subject });
    result.sent.push(key);
  };

  const notes: string[] = [];
  const unscored = await unscoredCallsInWeek(weekStart);
  if (unscored > 0) {
    const msg = `${unscored} qualifying call(s) from last week were still unscored when the briefs were written.`;
    notes.push(msg);
    result.alerts.push(msg);
  }

  const weeks: PodWeek[] = [];
  for (const pod of await getPods()) {
    const key = `pod:${pod.sdr_id}`;
    try {
      const week = await getPodWeek(pod, weekStart);
      weeks.push(week);
      if (done.has(key)) { result.skipped.push(key); continue; }
      if (week.calls.length < MIN_CALLS_FOR_BRIEF) {
        notes.push(`${pod.pe_name}: no scored calls last week, so no pod brief was sent.`);
        result.skipped.push(key);
        continue;
      }
      const content = await writePodBrief(week);
      const reviewNote = reviewTo ? `Review copy. Live, this goes to ${pod.pe_email} and ${pod.gd_email}.` : undefined;
      await send(key, [pod.pe_email, pod.gd_email], renderPodEmail(week, content, reviewNote));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      result.failed.push(key);
      result.alerts.push(`pod brief for ${pod.pe_name} failed: ${message.slice(0, 200)}`);
    }
  }

  if (!done.has('team') && teamTo) {
    try {
      const scored = weeks.filter((w) => w.calls.length > 0);
      const theme = scored.length >= 2 ? await writeTeamTheme(scored) : null;
      await send('team', [teamTo], renderTeamEmail(weekStart, theme, notes));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      result.failed.push('team');
      result.alerts.push(`huddle theme email failed: ${message.slice(0, 200)}`);
    }
  }

  await db.from('pipeline_runs').insert({
    kind: 'pod_briefs', finished_at: new Date().toISOString(), ok: result.failed.length === 0,
    summary: { week_start: weekStart, mode, sent: result.sent, skipped: result.skipped, failed: result.failed },
    alerts: result.alerts,
  });

  return result;
}
