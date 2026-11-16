// Turns brief content into a plain, readable email (HTML plus text fallback).

import { PodWeek } from './podBriefData';
import { PodBriefContent, TeamThemeContent } from './podBriefPrompt';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const first = (name: string) => name.split(' ')[0];

function weekLabel(weekStart: string): string {
  return new Date(`${weekStart}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

function trend(now: number | null, prior: number | null): string {
  if (now == null) return '';
  if (prior == null) return '';
  const diff = Math.round((now - prior) * 10) / 10;
  if (diff === 0) return ' (same as the previous 4 weeks)';
  return ` (${diff > 0 ? 'up' : 'down'} ${Math.abs(diff)} on the previous 4 weeks)`;
}

const FOOTER = 'Sent automatically by Call Coach from last week\'s scored calls (calls of 4 minutes or more). Reply to Russell with anything that looks wrong.';

const wrap = (inner: string) => `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.5;color:#2D1B4E;max-width:640px">${inner}<p style="color:#888;font-size:12px;margin-top:28px">${FOOTER}</p></div>`;
const h = (t: string) => `<h3 style="margin:22px 0 6px;color:#2D1B4E">${esc(t)}</h3>`;

export function renderPodEmail(week: PodWeek, b: PodBriefContent, reviewNote?: string) {
  const p = week.pod;
  const subject = `Call coaching: ${first(p.pe_name)}, week of ${weekLabel(week.week_start)}`;
  const strongest = week.area_avgs[week.area_avgs.length - 1];
  const weakest = week.area_avgs[0];
  const numbers = `${week.calls.length} calls scored, average ${week.avg_overall}/10${trend(week.avg_overall, week.prior_avg_overall)}.`
    + (strongest && weakest && strongest !== weakest ? ` Strongest: ${strongest.label} (${strongest.avg}). Weakest: ${weakest.label} (${weakest.avg}).` : '');

  const points = b.coaching_points.map((c, i) =>
    `<p style="margin:10px 0"><b>${i + 1}. ${esc(c.title)}</b><br>${esc(c.evidence)}<br><i>Why it matters:</i> ${esc(c.why)}<br><i>Next call:</i> ${esc(c.try_next)}</p>`).join('');

  const html = wrap(
    (reviewNote ? `<p style="background:#FFB8C0;padding:8px 12px;border-radius:6px">${esc(reviewNote)}</p>` : '')
    + `<p>${esc(first(p.pe_name))} and ${esc(first(p.gd_name))},</p>`
    + `<p style="font-size:17px"><b>${esc(b.headline)}</b></p>`
    + `<p>${esc(numbers)}</p>`
    + h('Coaching points') + points
    + h('Keep doing') + `<p>${esc(b.keep_doing)}</p>`
    + h(`1:1 drill: ${b.drill.title}`) + `<p>${esc(b.drill.setup)}</p><p>${esc(b.drill.how)}</p>`,
  );

  const text = [
    reviewNote, `${first(p.pe_name)} and ${first(p.gd_name)},`, b.headline, numbers,
    'COACHING POINTS', ...b.coaching_points.map((c, i) => `${i + 1}. ${c.title}\n${c.evidence}\nWhy it matters: ${c.why}\nNext call: ${c.try_next}`),
    'KEEP DOING', b.keep_doing, `1:1 DRILL: ${b.drill.title}`, b.drill.setup, b.drill.how, FOOTER,
  ].filter(Boolean).join('\n\n');

  return { subject, html, text };
}

export function renderTeamEmail(weekStart: string, t: TeamThemeContent | null, notes: string[]) {
  const subject = `Huddle theme from last week's calls, week of ${weekLabel(weekStart)}`;
  const theme = t
    ? `<p style="font-size:17px"><b>${esc(t.theme)}</b></p><ul>${t.evidence.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>`
      + h('10-minute huddle exercise') + `<p>${esc(t.huddle_exercise)}</p>`
      + h('Question for the room') + `<p>${esc(t.question_for_the_room)}</p>`
    : '<p>No team theme this week: not enough scored calls.</p>';
  const notesHtml = notes.length ? h('Notes') + `<ul>${notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : '';
  const text = [t ? `${t.theme}\n${t.evidence.map((e) => `- ${e}`).join('\n')}\n\nExercise: ${t.huddle_exercise}\n\nQuestion: ${t.question_for_the_room}` : 'No team theme this week.', ...notes, FOOTER].join('\n\n');
  return { subject, html: wrap(theme + notesHtml), text };
}
