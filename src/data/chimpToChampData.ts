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

export type PlaybookSection =
  | HeroSection
  | QuestionsSection
  | TextSection
  | CallFlowSection
  | ListSection;

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

  tabOrder: ['value-prop', 'questions', 'framework', 'call-flow'],

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
  ],
};
