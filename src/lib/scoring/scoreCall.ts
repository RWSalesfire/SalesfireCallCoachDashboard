// Scores one call transcript against the v2 rubric.
//
// The model judges each beat and quotes evidence; the overall score is
// calculated here from the beat weights. Structured outputs guarantee the JSON
// shape, so a malformed reply can't break the pipeline.

import Anthropic from '@anthropic-ai/sdk';
import { getClient } from '@/lib/claude';
import { COACH_MODEL } from '@/lib/models';
import { BEATS, craftScore, overallScore, rubricText, Outcome } from './rubric';
import { PRODUCT_FACTS, OUT_OF_DATE_CLAIMS, ClaimType } from './facts';

export type { Outcome };

export interface BeatResult { score: number; why: string; well: string; improve: string; try_next: string }
export interface ClaimFlag { type: ClaimType; said: string; correct_line: string }

const CLAIM_TYPES = Object.keys(OUT_OF_DATE_CLAIMS) as ClaimType[];
const claimList = CLAIM_TYPES.map((t) => `- ${t}: ${OUT_OF_DATE_CLAIMS[t].looks_like}`).join('\n');

export interface CallScore {
  outcome: Outcome;
  overall_score: number | null; // half result, half craft
  craft_score: number | null;   // weighted beats only
  beats: Record<string, BeatResult>; // only beats that were scored
  insight: string;
  key_moment: string;
  improvement: string;
  claim_flags: ClaimFlag[];
}

export interface CallToScore {
  company: string | null;
  prospect_name: string | null;
  duration_ms: number | null;
  disposition_label: string | null;
  transcript: string;
}

const SYSTEM = `You score recorded sales calls made by Salesfire Partnership Executives (outbound callers whose job is to book a meeting for a Growth Director). Salesfire helps UK ecommerce retailers get more revenue from their email flows.

Score each beat 0-10 against the rubric. Be demanding but fair, using this scale for every beat:
0-1 = not attempted at all.
2-3 = attempted but it went wrong (inaccurate, off-putting, or abandoned).
4-6 = done, with clear gaps (4 = the bare minimum, 6 = solid but missing something the rubric names).
7-8 = done well; worth playing in a team huddle.
9-10 = as good as it gets.
Most calls land 4-6 overall. Judge the beats of a good call, not whether the rep followed a script word for word. A successful call books a meeting, which means a day and time agreed on the call; "I'll email you some dates" is not booked.

Every call is a prospecting call, including calls to someone the rep has spoken to before and calls re-opening a closed-lost deal: the aim is still a meeting. A friendly catch-up that never gets to Salesfire or an ask is a missed opportunity; score it as such and say so in the insight.

The transcript is machine-made: brand names and words are often misheard (Klaviyo can appear as "Clavio" or "caveat", "flows" as "flaws") and speaker labels can be wrong. Judge what the rep clearly meant. Never mark a rep down, or flag a claim, because of a transcription error.

For every score, base it on what was actually said in the transcript. "why" quotes or closely describes the moment that decided the score. "try_next" is a specific line or behaviour for the next call, written as something the rep could actually say.

Facts about Salesfire (use these to judge accuracy; never invent other figures, results or customer stories):
${PRODUCT_FACTS}

Out-of-date claims. Add a claim_flags entry only when the rep (not the prospect) clearly makes one of these four claims, quoting their words in "said". Nothing else is ever flagged: not correct claims worded loosely (such as "140% more revenue from your Klaviyo flows"), not opinions, small talk or competitor comments. When unsure, don't flag. Do not lower the score for a flagged claim; the old scripts taught these lines.
${claimList}

Rubric:
${rubricText()}

Outcome: "demo" if a meeting was booked, "warm_lead" if interested but nothing booked, "email" if they asked for information by email, "not_interested", or "other".

Write in British English. Call the rep a Partnership Executive, never an SDR.`;

const beatSchema = {
  type: 'object',
  properties: {
    score: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
    why: { type: 'string' },
    well: { type: 'string' },
    improve: { type: 'string' },
    try_next: { type: 'string' },
  },
  required: ['score', 'why', 'well', 'improve', 'try_next'],
  additionalProperties: false,
};

const SCHEMA = {
  type: 'object',
  properties: {
    outcome: { type: 'string', enum: ['demo', 'email', 'not_interested', 'warm_lead', 'other'] },
    beats: {
      type: 'object',
      properties: Object.fromEntries(BEATS.map((b) => [b.key, beatSchema])),
      required: BEATS.map((b) => b.key),
      additionalProperties: false,
    },
    insight: { type: 'string', description: 'One-sentence coaching headline for this call' },
    key_moment: { type: 'string', description: 'The moment that most decided how the call went' },
    improvement: { type: 'string', description: 'The single highest-leverage change for this rep' },
    claim_flags: {
      type: 'array',
      items: {
        type: 'object',
        properties: { type: { type: 'string', enum: CLAIM_TYPES }, said: { type: 'string' } },
        required: ['type', 'said'],
        additionalProperties: false,
      },
    },
  },
  required: ['outcome', 'beats', 'insight', 'key_moment', 'improvement', 'claim_flags'],
  additionalProperties: false,
};

type RawScore = Omit<CallScore, 'overall_score' | 'beats' | 'claim_flags'> & {
  beats: Record<string, Omit<BeatResult, 'score'> & { score: number | null }>;
  claim_flags: { type: ClaimType; said: string }[];
};

const clamp = (n: number) => Math.max(0, Math.min(10, Math.round(n)));

export async function scoreCall(call: CallToScore): Promise<CallScore> {
  const minutes = Math.round((call.duration_ms || 0) / 60000);
  const response = await getClient().messages.create({
    model: COACH_MODEL,
    max_tokens: 16000,
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA } },
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{
      role: 'user',
      content: `Company: ${call.company || 'Unknown'}\nProspect: ${call.prospect_name || 'Unknown'}\nDuration: about ${minutes} minutes\nHubSpot disposition: ${call.disposition_label || 'N/A'}\n\nTRANSCRIPT:\n${call.transcript}`,
    }],
  });

  if (response.stop_reason === 'refusal') throw new Error('Scoring declined by the model (refusal)');
  if (response.stop_reason === 'max_tokens') throw new Error('Scoring reply was cut off (max_tokens)');

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text).join('');
  const raw = JSON.parse(text) as RawScore;

  const beats: Record<string, BeatResult> = {};
  const scores: Record<string, number | null> = {};
  for (const beat of BEATS) {
    const r = raw.beats[beat.key];
    // Beats that always apply can't be skipped: a missing one counts as not done.
    const score = r?.score == null ? (beat.onlyWhenItHappens ? null : 0) : clamp(r.score);
    scores[beat.key] = score;
    if (score != null) beats[beat.key] = { score, why: r?.why || '', well: r?.well || '', improve: r?.improve || '', try_next: r?.try_next || '' };
  }

  return {
    outcome: raw.outcome,
    overall_score: overallScore(scores, raw.outcome),
    craft_score: craftScore(scores),
    beats,
    insight: raw.insight,
    key_moment: raw.key_moment,
    improvement: raw.improvement,
    claim_flags: (raw.claim_flags || [])
      .filter((f) => f.type in OUT_OF_DATE_CLAIMS)
      .map((f) => ({ type: f.type, said: f.said, correct_line: OUT_OF_DATE_CLAIMS[f.type].correct_line })),
  };
}
