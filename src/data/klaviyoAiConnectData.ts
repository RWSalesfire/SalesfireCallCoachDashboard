import { PlaybookData } from './chimpToChampData';

export const klaviyoAiConnectData: PlaybookData = {
  title: 'Klaviyo AI Connect',
  description: 'Klaviyo AI Connect playbook — value prop, discovery questions & call flow',

  tabOrder: ['value-prop', 'questions', 'framework', 'call-flow'],

  sections: [
    // ── Value Prop tab ────────────────────────────────────────────────────
    {
      type: 'hero',
      id: 'value-prop',
      tabLabel: 'Value Prop',
      headline:
        'Klaviyo\'s only identifying a fraction of your website visitors. You\'re leaving revenue on the table.',
      pitch:
        'Cookies expire after 2–3 days, people browse on different devices, so one visitor looks like 8 strangers to Klaviyo. Your current flows could be sending to far more people. 20 minutes, I\'ll show you what doubling your flow revenue looks like.',
      pillars: [
        {
          title: 'Visitor Identification',
          description:
            'Cross-device tracking that doesn\'t rely on expiring cookies. Visitor identification that actually works.',
        },
        {
          title: 'Revenue Recovery',
          description:
            'Same flows, same setup, 200% more revenue through the door. Revenue recovery that doubles your current performance.',
        },
        {
          title: 'Ease of Implementation',
          description:
            '30-minute demo, free proof of concept, live in under 3 minutes.',
        },
      ],
    },

    // ── Questions tab ─────────────────────────────────────────────────────
    {
      type: 'questions',
      id: 'questions',
      tabLabel: 'Questions',
      intro:
        'Based on the Sandler Pain Funnel adapted for warm calls post-milk carton. These prospects have seen your emails and received the carton, so they\'re curious but unaware of the problem scale. Aim for 11–14 questions per call including rapport. These 5 core questions plus 3 situational ones give you a solid framework.',
      questions: [
        {
          number: 1,
          question:
            'If you had to give your email performance a score out of 10, where would you put it?',
          followUp: 'What\'s stopping it being higher?',
          whyItWorks:
            'Opens the door without being confrontational. Nobody says 10. Whatever number they give, the follow-up writes itself. Gets them self-diagnosing immediately.',
        },
        {
          number: 2,
          question:
            'When you look at your website traffic versus how many people are actually entering your browse abandonment flow, do those numbers make sense to you?',
          whyItWorks:
            'Most retailers never compare these numbers directly. Forces them to think about the gap between visitors and flow entries. The disconnect becomes obvious when you make them think about it.',
        },
        {
          number: 3,
          question: 'Would it be useful if I explained why that happens?',
          whyItWorks:
            'Micro-commitment question. Gets a small yes, positions you as helpful not pitchy. Sets up the education moment where you become the expert.',
        },
        {
          number: 4,
          question:
            'Most people don\'t realise Klaviyo cookies expire after 2–3 days, so someone visiting 8 times looks like 8 different strangers. Sound familiar?',
          whyItWorks:
            'Gives them the technical reason in simple terms. The "8 strangers" analogy makes it concrete. "Sound familiar?" gets confirmation they\'ve experienced this without knowing why.',
        },
        {
          number: 5,
          question:
            'Our retailers using AI Connect are recovering on average 200% more revenue through their Klaviyo flows without any change to their existing setup. Because what we\'re seeing is the longer retailers wait, the more revenue they\'re leaving on the table each month — would it be worth 20 minutes with one of our team to see what that could look like for you?',
          whyItWorks:
            'Social proof, specific results, no disruption concern addressed, urgency created, low commitment ask. If they say yes, add: "And if you like the look of it, we offer a free proof of concept."',
        },
        {
          number: 6,
          question:
            'Do you know roughly what percentage of your website visitors Klaviyo is actually identifying right now?',
          whenToUse:
            'When they\'re engaged but haven\'t grasped the scale. Most don\'t know the answer (it\'s usually a small fraction). Sets up the "invisible visitors" reveal.',
          isBonus: true,
        },
        {
          number: 7,
          question:
            'Have you ever wondered why your abandonment emails don\'t seem to be catching everyone who browses?',
          whenToUse:
            'When they mention abandonment performance or seem frustrated with flow results. Makes them think about the missing people, not just optimising for the people they can already see.',
          isBonus: true,
        },
        {
          number: 8,
          question:
            'If you could double your current flow performance without changing anything, what would that mean for your business?',
          whenToUse:
            'When building the business case. Gets them to quantify the opportunity in their own words. Whatever number they give becomes the value you\'re offering.',
          isBonus: true,
        },
      ],
    },

    // ── Framework tab ─────────────────────────────────────────────────────
    {
      type: 'text',
      id: 'framework',
      tabLabel: 'Framework',
      heading: 'Sandler Pain Funnel (Adapted)',
      overview:
        'Start with a permission-based opener, then use these questions to build the business case. These prospects have seen your emails and received the carton, so they\'re curious but unaware of the problem scale. Move from surface-level questions to implication questions that quantify the impact.',
      techniques: [
        {
          title: 'Mirroring',
          description:
            'Repeat the last 2–3 words they say, turn it into a question, then stop talking.',
          example:
            'Prospect: "We\'re not really seeing great results from our flows." → You: "Not great results?"',
        },
        {
          title: 'Implication Follow-up',
          description:
            'When they admit something\'s not great, don\'t jump to the pitch. Ask what it\'s costing them to turn a frustration into a quantified business problem.',
          example:
            '"How long has that been going on?" or "What does that mean for your business?"',
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
          description:
            'Permission-based opener referencing the milk carton to get agreement to proceed.',
        },
        {
          step: 2,
          label: 'Performance score',
          description:
            'Ask Q1 — gets them talking. Follow up with "What\'s stopping it being higher?" to surface general frustration.',
          questionRefs: [1],
        },
        {
          step: 3,
          label: 'Expose the gap',
          description:
            'Ask Q2 — traffic vs flow entries. Makes them think about a gap they\'ve probably never calculated.',
          questionRefs: [2],
        },
        {
          step: 4,
          label: 'Micro-commitment',
          description:
            'Ask Q3 — gets permission to educate. Positions you as helpful, not pitchy.',
          questionRefs: [3],
        },
        {
          step: 5,
          label: 'The "aha" moment',
          description:
            'Ask Q4 — cookie explanation. Gives them the reason the gap exists. The "8 strangers" analogy lands every time.',
          questionRefs: [4],
        },
        {
          step: 6,
          label: 'Demo close',
          description:
            'Ask Q5 — capitalise on the insight with social proof and urgency. If they say yes, add the free proof of concept.',
          questionRefs: [5],
        },
        {
          step: 7,
          label: 'Bonus questions',
          description:
            'Slot in Q6–Q8 wherever they naturally fit during the conversation.',
          questionRefs: [6, 7, 8],
        },
      ],
    },
  ],
};
