// Scoring rubric v2 (agreed with Russell 18 Nov 2026).
//
// Calls are scored on the beats of a good Partnership Executive call, not on
// following a script word for word. The scale is tough: 7 is a call worth
// playing in a huddle, most calls land 4-6. A successful call books a meeting.
// The overall score is calculated in code from these weights, never by the model.

export const RUBRIC_VERSION = 2;

export interface Beat {
  key: string;
  label: string;
  weight: number;
  onlyWhenItHappens: boolean; // scored only if the situation came up
  good: string;               // what this beat is
  anchors: { 3: string; 6: string; 9: string };
}

export const BEATS: Beat[] = [
  {
    key: 'gatekeeper', label: 'Gatekeeper', weight: 1, onlyWhenItHappens: true,
    good: 'Getting past reception or a PA to the right person, politely and with a reason they accept.',
    anchors: {
      3: 'Pitched to the gatekeeper or gave up at the first block.',
      6: 'Got through or got a name and a better time, but sounded like a sales call.',
      9: 'Sounded expected, gave a short credible reason, and was put through or given a direct route.',
    },
  },
  {
    key: 'earnRight', label: 'Earning the right to talk', weight: 1, onlyWhenItHappens: false,
    good: 'The opener gives a clear, relevant reason for calling (the carton, a trigger, something about their site or email set-up, or what was discussed last time) and gets permission for a couple of minutes.',
    anchors: {
      3: 'Generic "how are you" opener, no reason for the call, or launched straight into a pitch.',
      6: 'A reason was given and the prospect stayed on, but it was vague or permission was assumed.',
      9: 'Specific, relevant reason in the first 20 seconds, asked permission, and the prospect clearly agreed to continue.',
    },
  },
  {
    key: 'listening', label: 'Letting them talk', weight: 2, onlyWhenItHappens: false,
    good: 'Open questions about their email and Klaviyo (or Mailchimp) performance, then mirroring, pausing and implication follow-ups ("how long has that been going on?", "what does that mean for the business?") so the prospect describes their own problem before any pitch.',
    anchors: {
      3: 'Mostly the rep talking; closed questions; jumped to the pitch at the first hint of a problem; talked over answers.',
      6: 'Some open questions and the prospect shared things, but follow-ups were thin and the rep moved to the pitch too early.',
      9: 'Prospect did most of the talking in discovery, rep mirrored and dug in with implication questions, and the prospect named the gap in their own words.',
    },
  },
  {
    key: 'problem', label: 'Explaining the problem simply', weight: 2, onlyWhenItHappens: false,
    good: 'Explains, in plain language and tied to what the prospect said, why returning shoppers miss their flows: Klaviyo can\'t tell it\'s the same person across devices, and Safari clears the cookie after 7 days. An everyday analogy (such as the shop assistant who doesn\'t recognise you) helps. Checks it landed.',
    anchors: {
      3: 'No clear explanation, jargon, or a product pitch with no problem behind it.',
      6: 'Explained the idea but generically, or not linked to the prospect\'s own situation, or didn\'t check understanding.',
      9: 'Short, vivid, accurate explanation built on the prospect\'s own words, and the prospect visibly got it ("that makes sense", a follow-up question).',
    },
  },
  {
    key: 'proof', label: 'Proof that fits them', weight: 1, onlyWhenItHappens: false,
    good: 'Uses an approved result (see facts) from a retailer whose customers buy in a similar way, in one or two sentences.',
    anchors: {
      3: 'No proof, or an invented or unapproved figure.',
      6: 'An approved headline figure but not matched to the prospect.',
      9: 'A specific approved result from a closely matched retailer, landed briefly and linked to the prospect\'s situation.',
    },
  },
  {
    key: 'easyYes', label: 'Making it easy to say yes', weight: 1, onlyWhenItHappens: false,
    good: 'Removes effort and risk: one line of code, live in about 3 minutes, nothing for developers, free proof of concept (in Q4: demo now, proof of concept in Q1).',
    anchors: {
      3: 'Nothing said about effort, risk or the proof of concept.',
      6: 'Mentioned one of these in passing.',
      9: 'Used ease and the free proof of concept to make the meeting feel low-risk, at the moment it mattered.',
    },
  },
  {
    key: 'objections', label: 'Handling pushback', weight: 1, onlyWhenItHappens: true,
    good: 'When the prospect pushes back (busy, already have something, send an email, price), stays calm, acknowledges, asks a question back rather than arguing, and keeps the meeting ask alive.',
    anchors: {
      3: 'Accepted the brush-off straight away, argued, or got flustered.',
      6: 'Acknowledged and tried once, but didn\'t uncover what was behind it.',
      9: 'Acknowledged, asked a question that uncovered the real concern, answered it, and moved back to the meeting.',
    },
  },
  {
    key: 'meetingAsk', label: 'Asking for the meeting', weight: 2, onlyWhenItHappens: false,
    good: 'A confident, specific ask for a meeting with a day and time, using the prospect\'s own words about the problem. Success is a meeting booked.',
    anchors: {
      3: 'No ask, a vague one ("open to a chat sometime?"), or settled for "I\'ll send you some information".',
      6: 'Asked for a meeting and got a yes in principle with a rough timeframe ("first week of December", "email me some dates"), but no day and time locked on the call.',
      9: 'Specific day and time, framed around what the prospect said, and the meeting was booked.',
    },
  },
];

export const BEAT_LABELS: Record<string, string> = Object.fromEntries(BEATS.map((b) => [b.key, b.label]));

// Weighted average of the beats that were scored, rounded to 1 decimal.
export function overallScore(scores: Record<string, number | null>): number | null {
  let total = 0;
  let weights = 0;
  for (const beat of BEATS) {
    const s = scores[beat.key];
    if (typeof s !== 'number') continue;
    total += s * beat.weight;
    weights += beat.weight;
  }
  return weights ? Math.round((total / weights) * 10) / 10 : null;
}

export function rubricText(): string {
  return BEATS.map((b, i) => {
    const when = b.onlyWhenItHappens ? ' Score null if this never came up.' : ' Always score this; if the rep never did it, that is a 0-2.';
    return `${i + 1}. ${b.key} (${b.label}): ${b.good}${when}\n   3 = ${b.anchors[3]}\n   6 = ${b.anchors[6]}\n   9 = ${b.anchors[9]}`;
  }).join('\n');
}
