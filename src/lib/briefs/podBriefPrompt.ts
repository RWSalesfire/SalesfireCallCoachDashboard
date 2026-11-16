// Claude writes the coaching words; the numbers come from podBriefData.

import Anthropic from '@anthropic-ai/sdk';
import { getClient, MODEL, stripCodeFence } from '@/lib/claude';
import { PodWeek } from './podBriefData';

export interface PodBriefContent {
  headline: string;
  coaching_points: { title: string; evidence: string; why: string; try_next: string }[];
  keep_doing: string;
  drill: { title: string; setup: string; how: string };
}

export interface TeamThemeContent {
  theme: string;
  evidence: string[];
  huddle_exercise: string;
  question_for_the_room: string;
}

const VOICE = `Write in British English (optimise, behaviour). No em dashes. No exclamation marks. Do not use: delve, intricate, tapestry, pivotal, underscore, landscape, foster, testament, enhance, crucial, comprehensive, multifaceted, nuanced, groundbreaking, cutting-edge, game-changer, paradigm, synergy, realm, beacon, cornerstone. No "it's not X, it's Y" lines. No wrap-up phrases. Direct, specific, encouraging but honest. Call the rep a Partnership Executive, never an SDR.`;

const POD_PROMPT = `You are a sales coach at Salesfire, a UK ecommerce optimisation platform. Write the weekly coaching brief for one pod: a Partnership Executive (who makes the calls) and their Growth Director (who coaches them in a weekly 1:1). Both read it.

Use only what is in the call data. Every coaching point must cite a real call by company name and say what actually happened. Do not invent quotes. Pick the patterns that will move results most, not a list of everything.

Never invent figures, percentages, results or customer stories about Salesfire. If a suggested line needs a proof point, write "[your proof point]" in its place.

Keep it short enough to read in two minutes: every field is at most two sentences, and "evidence" cites at most two calls.

${VOICE}

Return ONLY a JSON object, no markdown:
{
  "headline": "one sentence: the single most important thing for this week",
  "coaching_points": [
    { "title": "max 8 words", "evidence": "which call(s) and what happened", "why": "why it costs meetings", "try_next": "a specific line or behaviour to use on the next call" }
  ],
  "keep_doing": "one strength to keep, citing a call",
  "drill": { "title": "max 8 words", "setup": "a 10-minute role-play for the 1:1 based on a real call", "how": "how the Growth Director runs it" }
}
Give exactly 2 coaching points.`;

const TEAM_PROMPT = `You are a sales coach at Salesfire. Below are last week's scored calls for every Partnership Executive. Find the one theme that most of the team shares and that would make a good 10-minute huddle segment. Cite real calls by person and company.

${VOICE}

Return ONLY a JSON object, no markdown:
{ "theme": "max 10 words", "evidence": ["2-4 short bullets citing calls"], "huddle_exercise": "a 10-minute exercise for the whole team", "question_for_the_room": "one open question" }`;

function callLines(week: PodWeek): string {
  return week.calls.map((c) => {
    const areas = Object.entries(c.areas)
      .map(([k, v]) => `${k} ${v.score}/10 (well: ${v.well}; improve: ${v.improve}; try: ${v.try_next})`)
      .join(' | ');
    return `- ${c.company} on ${c.date}, ${c.overall}/10. Insight: ${c.insight}. Key moment: ${c.key_moment}. Biggest improvement: ${c.improvement}. Areas: ${areas}`;
  }).join('\n');
}

function areaLines(week: PodWeek): string {
  return week.area_avgs.map((a) => `${a.label}: ${a.avg}/10 this week${a.prior != null ? `, ${a.prior} over the previous 4 weeks` : ''}`).join('; ');
}

// Belt and braces on the voice rules: the model sometimes slips an em dash in.
function cleanVoice<T>(value: T): T {
  return JSON.parse(JSON.stringify(value).replace(/\s?—\s?/g, ', ').replace(/!/g, '.')) as T;
}

async function askJson<T>(prompt: string, maxTokens: number): Promise<T> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  });
  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text).join('');
  return cleanVoice(JSON.parse(stripCodeFence(text)) as T);
}

// Reps will say these lines to prospects, so an invented claim ("we add 20%
// revenue") is a real risk. A % or £ figure only counts as real if it was
// said on a call (the transcripts); the per-call analyses have invented
// figures before. Otherwise: one rewrite, then a placeholder.
// £ amounts take thousands commas and decimals but never a trailing comma or
// full stop ("worth £2,000." must match "£2,000" said on the call).
const FIGURE = /£\s?\d+(?:,\d{3})*(?:\.\d+)?k?|(?<![\d.])\d+(?:\.\d+)?(?:\s?-\s?\d+(?:\.\d+)?)?\s?%/gi;
const norm = (s: string) => s.replace(/\s/g, '').toLowerCase();

function inventedFigures(output: unknown, source: string): string[] {
  const known = new Set((source.match(FIGURE) || []).map(norm));
  const found = JSON.stringify(output).match(FIGURE) || [];
  return Array.from(new Set(found.filter((f) => !known.has(norm(f)))));
}

async function askGrounded<T>(prompt: string, source: string, maxTokens: number): Promise<T> {
  let out = await askJson<T>(prompt, maxTokens);
  let invented = inventedFigures(out, source);
  if (invented.length === 0) return out;
  out = await askJson<T>(`${prompt}\n\nYour previous answer used figures that are not in the call data: ${invented.join(', ')}. Rewrite without them; use "[your proof point]" where a proof point is needed.`, maxTokens);
  invented = inventedFigures(out, source);
  if (invented.length === 0) return out;
  // Replace whole matches only, so removing "5%" can't turn a real "15%" into "1[...]".
  const bad = new Set(invented.map(norm));
  const json = JSON.stringify(out).replace(FIGURE, (m) => (bad.has(norm(m)) ? '[your proof point]' : m));
  return JSON.parse(json) as T;
}

export function writePodBrief(week: PodWeek): Promise<PodBriefContent> {
  const p = week.pod;
  const data = `Partnership Executive: ${p.pe_name}\nGrowth Director: ${p.gd_name}\nWeek starting ${week.week_start}: ${week.calls.length} scored calls, average ${week.avg_overall}/10 (previous 4 weeks: ${week.prior_avg_overall ?? 'no data'}).\nSkill averages, weakest first: ${areaLines(week)}\n\nCalls:\n${callLines(week)}`;
  const said = week.calls.map((c) => c.transcript).join('\n');
  return askGrounded<PodBriefContent>(`${POD_PROMPT}\n\n${data}`, said, 1500);
}

export function writeTeamTheme(weeks: PodWeek[]): Promise<TeamThemeContent> {
  const body = weeks.filter((w) => w.calls.length > 0)
    .map((w) => `## ${w.pod.pe_name}\n${callLines(w)}`).join('\n\n');
  const said = weeks.flatMap((w) => w.calls.map((c) => c.transcript)).join('\n');
  return askGrounded<TeamThemeContent>(`${TEAM_PROMPT}\n\n${body}`, said, 1500);
}
