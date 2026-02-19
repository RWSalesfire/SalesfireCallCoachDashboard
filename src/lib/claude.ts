import Anthropic from '@anthropic-ai/sdk';
import { Call, CallAnalysis } from './supabase';

const getClient = () => {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('Missing ANTHROPIC_API_KEY');
  return new Anthropic({ apiKey: key });
};

const MODEL = 'claude-sonnet-4-5-20250929';

// ──────────────────────────────────────────────
// Analyze a single call transcript
// ──────────────────────────────────────────────

interface AnalysisResult {
  outcome: 'demo' | 'email' | 'not_interested' | 'warm_lead' | 'other';
  overall_score: number;
  gatekeeper_score: number | null;
  opener_score: number;
  personalisation_score: number | null;
  discovery_score: number;
  call_control_score: number | null;
  tone_energy_score: number | null;
  value_prop_score: number;
  objections_score: number | null;
  close_score: number;
  insight: string;
  key_moment: string;
  improvement: string;
  talk_time_percent: number | null;
  talk_speed_wpm: number | null;
  longest_monologue_secs: number | null;
  customer_story_secs: number | null;
  patience_secs: number | null;
  area_breakdown: Record<string, { score: number; why: string; well: string; improve: string; try_next: string }>;
}

const SCORING_PROMPT = `You are a sales call analyst for Salesfire, a UK-based ecommerce optimisation platform. Salesfire products include:
- AI Connect — AI chatbot / product advisor for ecommerce sites
- Klaviyo Integration — email/SMS flows powered by Salesfire behavioural data
- Site Search — fast, AI-powered ecommerce search
- Recommendations — personalised product recommendations
- Overlays — exit-intent, urgency, social proof, email capture overlays
- Digital Assistant — guided selling journeys

Analyse the following cold/warm call transcript from an SDR (Sales Development Representative). Score each skill area 0-10 where applicable. If a skill was not relevant to the call (e.g. no gatekeeper encountered), return null for that score.

Skill areas:
1. gatekeeper — navigating past reception/PA (null if direct dial)
2. opener — first 15 seconds: confident, concise, reason for calling
3. personalisation — referencing the prospect's site, tech stack, or recent activity
4. discovery — asking open questions to understand pain points (null if call too short)
5. callControl — steering the conversation, managing tangents (null if call too short)
6. toneEnergy — warmth, pace, energy, active listening (null if call too short)
7. valueProp — clearly linking Salesfire products to prospect's needs
8. objections — handling pushback calmly and reframing value (null if no objections raised)
9. close — securing a clear next step (demo, email, follow-up)

Also estimate these call metrics (use null if you truly cannot estimate):
- talk_time_percent: SDR talk time as % of total call (0-100)
- talk_speed_wpm: SDR speaking speed in words per minute
- longest_monologue_secs: longest uninterrupted SDR speaking block in seconds
- customer_story_secs: longest uninterrupted prospect speaking block in seconds
- patience_secs: average pause before SDR responds after prospect finishes speaking

For EVERY skill area that received a numeric score (not null), you MUST provide an area_breakdown entry. Do NOT omit any scored area. Each entry must include:
- score: the numeric score (must match the score above)
- why: one-sentence justification
- well: what the SDR did well in this area
- improve: what could be improved
- try_next: a specific thing to try on the next call

Also provide:
- outcome: the call result — one of: demo, email, not_interested, warm_lead, other
- overall_score: weighted average (0-10) across applicable areas
- insight: 1-sentence coaching headline (e.g. "Strong opener but lost control mid-call")
- key_moment: quote or describe the most impactful moment
- improvement: the single highest-leverage improvement for this SDR

IMPORTANT: The area_breakdown object must contain an entry for EVERY skill area that has a numeric score (not null). If a score is null, do NOT include that area in area_breakdown. If a score is a number, you MUST include it.

Respond with ONLY a valid JSON object matching this exact structure (no markdown, no backticks):
{
  "outcome": "demo|email|not_interested|warm_lead|other",
  "overall_score": 7.2,
  "gatekeeper_score": null,
  "opener_score": 8,
  "personalisation_score": 6,
  "discovery_score": 7,
  "call_control_score": 6,
  "tone_energy_score": 7,
  "value_prop_score": 6,
  "objections_score": null,
  "close_score": 8,
  "insight": "...",
  "key_moment": "...",
  "improvement": "...",
  "talk_time_percent": 62,
  "talk_speed_wpm": 155,
  "longest_monologue_secs": 45,
  "customer_story_secs": 30,
  "patience_secs": 2,
  "area_breakdown": {
    "opener": { "score": 8, "why": "...", "well": "...", "improve": "...", "try_next": "..." },
    "personalisation": { "score": 6, "why": "...", "well": "...", "improve": "...", "try_next": "..." },
    "discovery": { "score": 7, "why": "...", "well": "...", "improve": "...", "try_next": "..." },
    "callControl": { "score": 6, "why": "...", "well": "...", "improve": "...", "try_next": "..." },
    "toneEnergy": { "score": 7, "why": "...", "well": "...", "improve": "...", "try_next": "..." },
    "valueProp": { "score": 6, "why": "...", "well": "...", "improve": "...", "try_next": "..." },
    "close": { "score": 8, "why": "...", "well": "...", "improve": "...", "try_next": "..." }
  }
}`;

function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith('```')) {
    return trimmed.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  return trimmed;
}

export async function analyzeCallTranscript(call: Call): Promise<AnalysisResult> {
  const client = getClient();

  const userMessage = `Company: ${call.company || 'Unknown'}
Prospect: ${call.prospect_name || 'Unknown'}
Duration: ${call.duration_formatted || `${Math.round((call.duration_ms || 0) / 1000)}s`}
Disposition from HubSpot: ${call.disposition_label || call.disposition || 'N/A'}

TRANSCRIPT:
${call.transcript}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [
      { role: 'user', content: `${SCORING_PROMPT}\n\n${userMessage}` },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  const parsed: AnalysisResult = JSON.parse(stripCodeFence(text));
  return parsed;
}

// ──────────────────────────────────────────────
// Generate daily focus instruction
// ──────────────────────────────────────────────

const FOCUS_PROMPT = `You are a sales coach at Salesfire. Based on today's analysed calls for an SDR, identify the single most impactful pattern and generate a coaching instruction for tomorrow.

The instruction should be:
- One concise sentence (max 25 words)
- Actionable and specific
- Focused on what TO DO (not what not to do)
- Reference a specific skill area or behaviour observed across calls

Also identify the pattern you based this on (1 sentence).

Respond with ONLY a valid JSON object:
{
  "instruction": "...",
  "pattern_identified": "..."
}`;

interface FocusResult {
  instruction: string;
  pattern_identified: string;
}

export async function generateDailyFocus(
  sdrName: string,
  analyses: Pick<CallAnalysis, 'overall_score' | 'insight' | 'improvement' | 'area_breakdown'>[],
  companies: string[]
): Promise<FocusResult> {
  const client = getClient();

  const callSummaries = analyses.map((a, i) => {
    const weakAreas = a.area_breakdown
      ? Object.entries(a.area_breakdown)
          .filter(([, v]) => v.score <= 5)
          .map(([k, v]) => `${k}: ${v.score}/10`)
          .join(', ')
      : 'N/A';

    return `Call ${i + 1} (${companies[i] || 'Unknown'}): ${a.overall_score}/10 — ${a.insight || 'No insight'}. Weak: ${weakAreas || 'none'}. Improve: ${a.improvement || 'N/A'}`;
  }).join('\n');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `${FOCUS_PROMPT}\n\nSDR: ${sdrName}\nToday's calls:\n${callSummaries}`,
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  return JSON.parse(stripCodeFence(text));
}

// ──────────────────────────────────────────────
// Generate weekly focus coaching advice
// ──────────────────────────────────────────────

const WEEKLY_FOCUS_PROMPT = `You are a sales coach at Salesfire. Analyse this week's cold calls for an SDR and identify the single most important coaching focus for next week.

Return a JSON object with:
- title: A short coaching focus title (max 8 words, e.g. "Handle early objections with curiosity")
- triggers: 2-3 specific situations/phrases from the calls where this issue appeared
- dont: What the SDR should STOP doing (one concise sentence)
- do: What the SDR should START doing instead (one concise sentence)
- example.context: A brief scenario based on a real call this week
- example.couldHaveSaid: What the SDR could have said in that scenario (a natural sentence, not a script)

Focus on the pattern that appeared most often or caused the most lost opportunities. Be specific to what you see in the calls — avoid generic advice.

Respond with ONLY a valid JSON object (no markdown, no backticks):
{
  "title": "...",
  "triggers": ["...", "..."],
  "dont": "...",
  "do": "...",
  "example": { "context": "...", "couldHaveSaid": "..." }
}`;

interface WeeklyFocusResult {
  title: string;
  triggers: string[];
  dont: string;
  do: string;
  example: { context: string; couldHaveSaid: string };
}

export async function generateWeeklyFocus(
  sdrName: string,
  analyses: Pick<CallAnalysis, 'overall_score' | 'insight' | 'improvement' | 'area_breakdown'>[],
  companies: string[]
): Promise<WeeklyFocusResult> {
  const client = getClient();

  const callSummaries = analyses.map((a, i) => {
    const weakAreas = a.area_breakdown
      ? Object.entries(a.area_breakdown)
          .filter(([, v]) => v.score <= 5)
          .map(([k, v]) => `${k}: ${v.score}/10 — ${v.improve || ''}`)
          .join('; ')
      : 'N/A';

    const strongAreas = a.area_breakdown
      ? Object.entries(a.area_breakdown)
          .filter(([, v]) => v.score >= 7)
          .map(([k, v]) => `${k}: ${v.score}/10`)
          .join(', ')
      : 'N/A';

    return `Call ${i + 1} (${companies[i] || 'Unknown'}): ${a.overall_score}/10 — ${a.insight || 'No insight'}. Weak: ${weakAreas || 'none'}. Strong: ${strongAreas || 'none'}. Key improvement: ${a.improvement || 'N/A'}`;
  }).join('\n');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `${WEEKLY_FOCUS_PROMPT}\n\nSDR: ${sdrName}\nThis week's calls (${analyses.length} total):\n${callSummaries}`,
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  return JSON.parse(stripCodeFence(text));
}
