// ─── Section type interfaces ──────────────────────────────────────────────────

export interface HeroSection {
  type: 'hero';
  id: string;
  tabLabel: string;
  headline: string;
  pitch: string;
  pillars: { title: string; description: string }[];
}

export interface Question {
  number: number;
  question: string;
  followUp?: string;
  whyItWorks?: string;
  whenToUse?: string;
  isBonus?: boolean;
}

export interface QuestionsSection {
  type: 'questions';
  id: string;
  tabLabel: string;
  intro: string;
  questions: Question[];
}

export interface Technique {
  title: string;
  description: string;
  example?: string;
}

export interface TextSection {
  type: 'text';
  id: string;
  tabLabel: string;
  heading: string;
  overview: string;
  techniques: Technique[];
}

export interface CallFlowStep {
  step: number;
  label: string;
  description: string;
  questionRefs?: number[];
}

export interface CallFlowSection {
  type: 'call-flow';
  id: string;
  tabLabel: string;
  steps: CallFlowStep[];
}

export interface ListSection {
  type: 'list';
  id: string;
  tabLabel: string;
  heading: string;
  items: { title: string; description: string }[];
}

export interface ScriptLine {
  speaker: 'sdr' | 'prospect';
  line: string;
  note?: string;
}

export interface VerbatimStage {
  format: 'verbatim';
  title: string;
  instruction: string;
  lines: ScriptLine[];
}

export interface GuidedStage {
  format: 'guided';
  title: string;
  instruction: string;
  bullets: { text: string; questionRef?: number }[];
}

export interface ScriptObjection {
  trigger: string;
  response: string;
  followUp?: string;
}

export interface ScriptVariation {
  id: string;
  label: string;
  description: string;
  temperature: 'cool' | 'warm';
  stages: (VerbatimStage | GuidedStage)[];
  objections: ScriptObjection[];
}

export interface ScriptSection {
  type: 'script';
  id: string;
  tabLabel: string;
  intro: string;
  variations: ScriptVariation[];
}

export type PlaybookSection =
  | HeroSection
  | QuestionsSection
  | TextSection
  | CallFlowSection
  | ListSection
  | ScriptSection;

export interface PlaybookData {
  title: string;
  description: string;
  tabOrder: string[];
  sections: PlaybookSection[];
}

// ─── Chimp to Champ content ───────────────────────────────────────────────────

export const chimpToChampData: PlaybookData = {
  title: 'Chimp to Champ',
  description: 'Mailchimp conversion playbook — value prop, discovery questions & call flow',

  tabOrder: ['value-prop', 'questions', 'framework', 'call-flow', 'scripts'],

  sections: [
    // ── Value Prop tab ────────────────────────────────────────────────────
    {
      type: 'hero',
      id: 'value-prop',
      tabLabel: 'Value Prop',
      headline: 'You\'ve outgrown Mailchimp. Let\'s talk about what\'s next.',
      pitch:
        'Mailchimp was great when you were starting out — but now your flows are limited, your data\'s siloed, and you\'re leaving revenue on the table. We help brands like yours migrate to a platform that actually scales with you.',
      pillars: [
        {
          title: 'Automation',
          description:
            'Advanced flows that trigger on real behaviour — not just opens. Abandoned browse, price drop, back-in-stock, post-purchase — all running 24/7.',
        },
        {
          title: 'Personalisation',
          description:
            'Dynamic content blocks, predictive send times, and segments built on actual purchase data — not just list tags.',
        },
        {
          title: 'Support',
          description:
            'Dedicated onboarding, migration handled for you, and a team that actually picks up the phone. No more chatbot runaround.',
        },
      ],
    },

    // ── Questions tab ─────────────────────────────────────────────────────
    {
      type: 'questions',
      id: 'questions',
      tabLabel: 'Questions',
      intro:
        'Use these during discovery to uncover pain with their current Mailchimp setup. Core questions first, bonus questions when the conversation opens up.',
      questions: [
        {
          number: 1,
          question: 'How are you finding Mailchimp for your email marketing right now?',
          followUp: 'What made you set it up that way originally?',
          whyItWorks:
            'Open-ended and non-threatening. Lets them self-diagnose — most will volunteer frustrations without you having to push.',
        },
        {
          number: 2,
          question: 'What does your current flow setup look like — welcome series, abandoned cart, that kind of thing?',
          followUp: 'Are those performing the way you\'d like?',
          whyItWorks:
            'Gets specific about their automation maturity. Mailchimp users often have basic flows or none at all — this exposes the gap.',
        },
        {
          number: 3,
          question: 'When you look at your email revenue vs your site traffic, do the numbers add up?',
          followUp: 'What do you think is causing that gap?',
          whyItWorks:
            'Introduces the revenue gap concept. Forces them to confront the disconnect between traffic and email capture — which is where we win.',
        },
        {
          number: 4,
          question: 'Have you ever felt limited by what Mailchimp can do — segmentation, reporting, anything like that?',
          followUp: 'Tell me more about that...',
          whyItWorks:
            'Directly surfaces platform frustration. "Have you ever felt limited" is softer than "What\'s wrong with Mailchimp" but gets the same answer.',
        },
        {
          number: 5,
          question: 'If you could change one thing about your email setup tomorrow, what would it be?',
          whyItWorks:
            'Future-pacing question. Gets them to articulate their ideal state — which you can then map back to your solution.',
        },
        {
          number: 6,
          question: 'What\'s your process when someone browses your site but doesn\'t buy — do you have anything set up to bring them back?',
          whenToUse: 'When they haven\'t mentioned browse abandonment — highlights a gap most Mailchimp users don\'t cover.',
          isBonus: true,
        },
        {
          number: 7,
          question: 'How much time does your team spend building emails each week?',
          whenToUse: 'When they mention resource constraints or doing everything manually — positions automation as a time-saver.',
          isBonus: true,
        },
        {
          number: 8,
          question: 'Have you looked at what a move to Klaviyo (or similar) would actually involve?',
          whenToUse: 'Late in the call when they\'re warm — tests buying intent and opens the door to a migration conversation.',
          isBonus: true,
        },
      ],
    },

    // ── Framework tab ─────────────────────────────────────────────────────
    {
      type: 'text',
      id: 'framework',
      tabLabel: 'Framework',
      heading: 'Sandler Pain Funnel',
      overview:
        'Start broad, then dig deeper. The goal isn\'t to interrogate — it\'s to help them realise the cost of staying where they are. Move from surface-level questions to implication questions that quantify the impact.',
      techniques: [
        {
          title: 'Mirroring',
          description:
            'Repeat back the last few words they said as a question. It keeps them talking without you having to think of a new question.',
          example: 'Prospect: "We\'ve been struggling with deliverability." → You: "Struggling with deliverability?"',
        },
        {
          title: 'Implication Follow-up',
          description:
            'After they share a pain point, ask what it\'s costing them. This turns a frustration into a quantified business problem.',
          example: '"What does that mean for your Q2 revenue targets?" or "How many sales do you think you\'re missing because of that?"',
        },
      ],
    },

    // ── Call Flow tab ─────────────────────────────────────────────────────
    {
      type: 'call-flow',
      id: 'call-flow',
      tabLabel: 'Call Flow',
      steps: [
        {
          step: 1,
          label: 'Open',
          description: 'Permission-based opener. Mention you spotted something about their email setup.',
        },
        {
          step: 2,
          label: 'Warm-up',
          description: 'Ask Q1 — broad, non-threatening. Let them talk. Mirror anything interesting.',
          questionRefs: [1],
        },
        {
          step: 3,
          label: 'Dig into setup',
          description: 'Ask Q2 to understand their current flows. Follow up on gaps.',
          questionRefs: [2],
        },
        {
          step: 4,
          label: 'Introduce the gap',
          description: 'Ask Q3 — revenue vs traffic. This is your "aha" moment. Pause and let it land.',
          questionRefs: [3],
        },
        {
          step: 5,
          label: 'Surface frustration',
          description: 'Ask Q4 — have they felt limited? Use implication follow-ups to quantify the pain.',
          questionRefs: [4],
        },
        {
          step: 6,
          label: 'Future-pace',
          description: 'Ask Q5 — what would they change? Map their answer to your value prop pillars.',
          questionRefs: [5],
        },
        {
          step: 7,
          label: 'Bonus questions',
          description: 'If the conversation is flowing, weave in Q6–Q8 where they fit naturally.',
          questionRefs: [6, 7, 8],
        },
        {
          step: 8,
          label: 'Bridge to value prop',
          description: 'Summarise what you heard, connect it to the three pillars (Automation, Personalisation, Support).',
        },
        {
          step: 9,
          label: 'Close',
          description: 'Specific ask: "Would Thursday at 2pm work for a 15-minute demo?" Lock in the day and time.',
        },
      ],
    },

    // ── Scripts tab ──────────────────────────────────────────────────────
    {
      type: 'script',
      id: 'scripts',
      tabLabel: 'Scripts',
      intro:
        'Two hybrid call scripts combining Good Call coaching principles with the Chimp to Champ playbook. Pick the variation that matches your prospect\u2019s email engagement.',
      variations: [
        // ── Variation A: No Email Engagement (cool) ──────────────────────
        {
          id: 'no-email',
          label: 'No Email Engagement',
          description:
            'Use when the prospect hasn\u2019t opened or clicked the breakup sequence. Colder approach \u2014 lead with curiosity and a site-specific hook.',
          temperature: 'cool',
          stages: [
            {
              format: 'verbatim',
              title: 'Opener',
              instruction: 'Under 30 seconds. 130\u2013140 wpm. Permission-based.',
              lines: [
                {
                  speaker: 'sdr',
                  line: 'Hi [Name], it\u2019s [Your name] from Salesfire.',
                },
                {
                  speaker: 'sdr',
                  line: 'I\u2019ll be straight with you \u2014 I was looking at your site and noticed you\u2019re on Mailchimp. I work with retailers who\u2019ve outgrown it and I think I\u2019ve spotted something that could help. Can I take 60 seconds to explain why I\u2019m calling?',
                },
                {
                  speaker: 'prospect',
                  line: '[Agrees / asks what it\u2019s about]',
                  note: 'If they push back, go to Objections.',
                },
              ],
            },
            {
              format: 'guided',
              title: 'Discovery',
              instruction:
                'Under 50% talk time. Ask, pause, listen. Mirror anything interesting. Use implication follow-ups to quantify pain.',
              bullets: [
                { text: 'Start broad: \u201cHow are you finding Mailchimp right now?\u201d', questionRef: 1 },
                { text: 'Dig into flows: \u201cWhat does your current flow setup look like?\u201d', questionRef: 2 },
                { text: 'Introduce revenue gap: \u201cWhen you look at email revenue vs site traffic, do the numbers add up?\u201d', questionRef: 3 },
                { text: 'Surface frustration: \u201cHave you ever felt limited by what Mailchimp can do?\u201d', questionRef: 4 },
                { text: 'Future-pace: \u201cIf you could change one thing tomorrow, what would it be?\u201d', questionRef: 5 },
                { text: 'Mirror anything interesting. Pause after questions. Let silence work.' },
                { text: 'Use implication follow-ups: \u201cWhat does that mean for your Q2 targets?\u201d' },
              ],
            },
            {
              format: 'guided',
              title: 'Value Prop Bridge',
              instruction:
                'Summarise what you heard, then connect to the three pillars. Anchor each to something the prospect said.',
              bullets: [
                { text: 'Summarise: \u201cSo if I\u2019m hearing you right, the main challenge is [X] \u2014 is that fair?\u201d' },
                { text: 'Automation pillar: advanced flows triggered on real behaviour, running 24/7.' },
                { text: 'Personalisation pillar: dynamic content, predictive send times, purchase-based segments.' },
                { text: 'Support pillar: managed migration, dedicated onboarding, real humans.' },
                { text: 'Anchor: \u201cBased on what you said about [X], imagine if [outcome]\u2026\u201d' },
              ],
            },
            {
              format: 'verbatim',
              title: 'Close',
              instruction: 'Specific ask. Lock in day & time. Confirm email.',
              lines: [
                {
                  speaker: 'sdr',
                  line: 'I think a 15-minute demo would show you more than another email. How does Thursday at 2pm look?',
                },
                {
                  speaker: 'sdr',
                  line: 'Great, [day] at [time] it is. I\u2019ll send a calendar invite now \u2014 is [email] the best one? Anything specific you want me to focus on in the demo?',
                },
              ],
            },
          ],
          objections: [
            {
              trigger: 'Just send me an email',
              response:
                'Of course I can. Usually when someone asks me to send an email it\u2019s just a polite way to get rid of me \u2014 when was the last time you read an email that was actually better than a conversation?',
              followUp:
                'Does it make sense for me to stick a placeholder in your calendar and give you a call when it\u2019s a better time?',
            },
            {
              trigger: 'We\u2019re happy with Mailchimp',
              response:
                'Good to hear. When you compare your site traffic to people entering your email flows, do those numbers add up?',
              followUp:
                'Most brands think it\u2019s fine until they see the gap. Worth 15 minutes to check?',
            },
            {
              trigger: 'No budget right now',
              response:
                'Makes sense. This isn\u2019t additional spend \u2014 it\u2019s recovering revenue from the setup you\u2019re already paying for.',
              followUp:
                'If I could show you you\u2019re leaving [X]% on the table, would that change the conversation?',
            },
            {
              trigger: 'We\u2019ve already looked at switching',
              response: 'Oh interesting \u2014 what held you back?',
              followUp:
                'Our migration is fully managed by our team, not yours. Would that change things?',
            },
            {
              trigger: 'Not interested / bad timing',
              response:
                'Fair enough. Before I go \u2014 are you happy with what your email flows are producing relative to your site traffic?',
              followUp:
                'If the answer is no, it\u2019s only going to get worse as cookies expire. When\u2019s a better time?',
            },
          ],
        },

        // ── Variation B: Email Engaged (warm) ────────────────────────────
        {
          id: 'email-engaged',
          label: 'Email Engaged',
          description:
            'Use when the prospect opened or clicked the breakup sequence. Warmer approach \u2014 reference the email themes directly.',
          temperature: 'warm',
          stages: [
            {
              format: 'verbatim',
              title: 'Opener',
              instruction:
                'Reference the emails up front. If they recall them, lean in. If not, pivot to Script A opener.',
              lines: [
                {
                  speaker: 'sdr',
                  line: 'Hi [Name], it\u2019s [Your name] from Salesfire. We sent you a few emails recently \u2014 the ones about the signs it might be time to move on from your email platform. Did any of those land with you?',
                },
                {
                  speaker: 'prospect',
                  line: '[Yes / vaguely / which ones?]',
                  note: 'If yes, lean in. If vague, reference \u201c5 signs it\u2019s over\u201d. If no, pivot to Script A opener.',
                },
                {
                  speaker: 'sdr',
                  line: 'The reason I\u2019m calling is those emails aren\u2019t just marketing \u2014 they\u2019re based on real patterns we see with Mailchimp retailers every day. Can I take 2 minutes to show you what I mean?',
                },
              ],
            },
            {
              format: 'guided',
              title: 'Discovery',
              instruction:
                'The emails have done the heavy lifting \u2014 your job is to quantify the pain they\u2019ve already recognised.',
              bullets: [
                { text: 'Bridge from emails: \u201cThe \u20185 signs\u2019 email talks about outgrowing your platform \u2014 which of those rang true for you?\u201d' },
                { text: 'Dig into flows: \u201cWhat does your current automation setup look like?\u201d', questionRef: 2 },
                { text: 'Reference the \u201c8 strangers\u201d problem: \u201cOne of the emails mentioned cookies expire so fast that one visitor looks like 8 strangers. Have you noticed your browse abandonment flows aren\u2019t catching everyone?\u201d' },
                { text: 'Revenue gap: \u201cWhen you look at email revenue vs site traffic, do the numbers add up?\u201d', questionRef: 3 },
                { text: 'Reference \u201cyour platform won\u2019t change\u201d: \u201cIs that something you\u2019ve felt? Where are you hitting walls?\u201d', questionRef: 4 },
                { text: 'Future-pace: \u201cIf you could change one thing tomorrow, what would it be?\u201d', questionRef: 5 },
              ],
            },
            {
              format: 'guided',
              title: 'Value Prop Bridge',
              instruction:
                'Anchor to the case studies from Email 4. Let the prospect choose which result is most relevant.',
              bullets: [
                { text: 'Summarise: \u201cBased on what you\u2019re telling me, and what the emails were getting at, the main issue is [X] \u2014 fair?\u201d' },
                { text: 'Anchor to Email 4 case studies: \u201cIn the last email we talked about life after the break-up \u2014 those are real brands.\u201d' },
                { text: 'Gingerlily: 190% more clicks after moving off Mailchimp.' },
                { text: 'Hatton Park Saddlery: 15% of total revenue from email alone.' },
                { text: 'Detox Trading: 74% more conversions from the same flows.' },
                { text: 'Connect: \u201cGiven what you said about [X], which of those results sounds most relevant to you right now?\u201d' },
              ],
            },
            {
              format: 'verbatim',
              title: 'Close',
              instruction: 'Bridge from theory (emails) to proof (demo). Mention free proof of concept if they\u2019re keen.',
              lines: [
                {
                  speaker: 'sdr',
                  line: 'Look, the emails gave you the theory \u2014 a 15-minute demo gives you the proof. I can show you exactly what this would look like for [their store]. How does Thursday at 2pm work?',
                },
                {
                  speaker: 'sdr',
                  line: 'Perfect, [day] at [time]. I\u2019ll send a calendar invite now. Anything specific you want me to dig into?',
                  note: 'If keen, add: \u201cAnd if you like the look of it, we do a free proof of concept \u2014 live in under 3 minutes.\u201d',
                },
              ],
            },
          ],
          objections: [
            {
              trigger: 'Read the emails but not looking to switch',
              response:
                'Totally fair. Was there anything that surprised you \u2014 anything you didn\u2019t know about how Mailchimp handles cookies?',
              followUp:
                'If the \u20188 strangers\u2019 thing is happening, you\u2019re leaving revenue on the table every day. Worth 15 minutes to see the scale?',
            },
            {
              trigger: 'Interesting but we\u2019re locked into Mailchimp',
              response:
                'How long is left on your contract? We can time the migration around your renewal.',
              followUp:
                'Gingerlily thought the same \u2014 they were surprised how quick the switch was. Worth a demo so you\u2019re ready at renewal?',
            },
            {
              trigger: 'Don\u2019t have resource to migrate',
              response:
                'That\u2019s the part most people worry about \u2014 and it\u2019s the part we handle entirely. Migration is fully managed, done by our team.',
              followUp:
                'Hatton Park Saddlery had the same concern. Now email is 15% of total revenue. Could I show you what managed migration involves?',
            },
            {
              trigger: 'Those case studies are impressive but we\u2019re smaller',
              response:
                'Those brands aren\u2019t huge either \u2014 Detox Trading is a niche health retailer. The 74% uplift came from the same flows, just reaching more people.',
              followUp:
                'Would it be worth seeing what it looks like at your scale? Proof of concept is free, takes 3 minutes to set up.',
            },
            {
              trigger: 'Send me more info',
              response:
                'Happy to. You\u2019ve already read the best stuff though. What would a new email tell you that a 15-minute call wouldn\u2019t?',
              followUp:
                'I\u2019d rather show you your own data than send you someone else\u2019s. How about a quick demo instead?',
            },
          ],
        },
      ],
    },
  ],
};
