import { PlaybookData } from './chimpToChampData';

export const klaviyoAiConnectData: PlaybookData = {
  title: 'Klaviyo AI Connect',
  description: 'Klaviyo AI Connect playbook — value prop, discovery questions & call flow',

  tabOrder: ['value-prop', 'questions', 'framework', 'call-flow', 'scripts'],

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

    // ── Scripts tab ──────────────────────────────────────────────────────
    {
      type: 'script',
      id: 'scripts',
      tabLabel: 'Scripts',
      intro:
        'Call script combining Good Call coaching principles with the Klaviyo AI Connect playbook. Reference the milk carton and email sequence to build on the prospect\u2019s existing awareness.',
      variations: [
        // ── Carton Engaged (warm) ───────────────────────────────────────
        {
          id: 'carton-engaged',
          label: 'Carton Engaged',
          description:
            'Use when the prospect opened/clicked the milk carton or email sequence. Warmer approach \u2014 reference the milk carton and email themes directly.',
          temperature: 'warm',
          stages: [
            {
              format: 'verbatim',
              title: 'Opener',
              instruction:
                'Reference the milk carton up front. If they recall it, lean in. If not, pivot to Script A opener.',
              lines: [
                {
                  speaker: 'sdr',
                  line: 'Hi [Name], it\u2019s [Your name] from Salesfire. We sent you something a bit different recently \u2014 a milk carton with a missing person on the front. Do you remember it?',
                },
                {
                  speaker: 'prospect',
                  line: '[Yes / vaguely / which one?]',
                  note: 'If yes, lean in. If vague, briefly explain the carton concept. If no, pivot to Script A opener.',
                },
                {
                  speaker: 'sdr',
                  line: 'The reason we sent it is that the \u201cmissing person\u201d is actually your website visitors \u2014 the ones Klaviyo can\u2019t see because cookies expire after 2\u20133 days. Can I take 2 minutes to show you what I mean?',
                },
              ],
            },
            {
              format: 'verbatim',
              title: 'Discovery',
              instruction:
                'The carton has done the heavy lifting. Your job is to quantify the pain they\u2019ve already glimpsed.',
              lines: [
                {
                  speaker: 'sdr',
                  line: 'So the milk carton was about missing visitors. Here\u2019s a question \u2014 when you look at your website traffic versus how many people are actually entering your browse abandonment flow, do those numbers make sense to you?',
                },
                {
                  speaker: 'prospect',
                  line: '[Responds \u2014 usually surprised or unsure]',
                },
                {
                  speaker: 'sdr',
                  line: 'And if you had to give your email performance a score out of 10, where would you put it?',
                },
                {
                  speaker: 'prospect',
                  line: '[Gives a number]',
                },
                {
                  speaker: 'sdr',
                  line: 'What\u2019s stopping it being higher?',
                  note: 'Mirror whatever they say. Let them talk \u2014 the more they share, the stronger your close.',
                },
                {
                  speaker: 'prospect',
                  line: '[Explains frustrations]',
                },
                {
                  speaker: 'sdr',
                  line: 'That\u2019s exactly what the emails were getting at. Klaviyo cookies expire after 2\u20133 days, so one visitor looks like eight strangers. Your flows aren\u2019t broken \u2014 they just can\u2019t see most of the people browsing your site. Have you noticed your abandonment emails aren\u2019t catching everyone?',
                },
                {
                  speaker: 'prospect',
                  line: '[Responds]',
                },
                {
                  speaker: 'sdr',
                  line: 'Here\u2019s what I\u2019d love to know \u2014 if you could double your current flow performance without changing anything, what would that mean for your business?',
                  note: 'Whatever number or outcome they give becomes the value you\u2019re offering. Use their words in the close.',
                },
              ],
            },
            {
              format: 'verbatim',
              title: 'Value Prop Bridge',
              instruction:
                'Anchor back to the milk carton theme \u2014 missing visitors, found. Let the prospect connect the dots.',
              lines: [
                {
                  speaker: 'sdr',
                  line: 'Based on what you\u2019re telling me, and what the milk carton was getting at, the main issue is [X] \u2014 fair?',
                },
                {
                  speaker: 'prospect',
                  line: '[Confirms / clarifies]',
                },
                {
                  speaker: 'sdr',
                  line: 'That\u2019s exactly the problem AI Connect solves. The \u201cmissing person\u201d on the carton \u2014 that\u2019s your website visitors that Klaviyo can\u2019t identify. AI Connect gives you cross-device tracking that doesn\u2019t rely on expiring cookies. Same flows you\u2019re already running, same Klaviyo setup, but 200% more revenue because you\u2019re finally reaching the visitors you couldn\u2019t see before.',
                },
                {
                  speaker: 'sdr',
                  line: 'And setup is painless \u2014 30-minute demo, free proof of concept, live in under 3 minutes. No changes to your existing setup. Given what you said about [X], which part of that sounds most relevant to you right now?',
                  note: 'Pause. Let them pick. Whatever they choose tells you how to frame the close.',
                },
              ],
            },
            {
              format: 'verbatim',
              title: 'Close',
              instruction: 'Bridge from the carton (theory) to the demo (proof). Lock in a time.',
              lines: [
                {
                  speaker: 'sdr',
                  line: 'The milk carton gave you the problem \u2014 a 20-minute demo gives you the solution. I can show you exactly what this looks like for [their store]. How does [day] at [time] work?',
                },
                {
                  speaker: 'prospect',
                  line: '[Agrees]',
                },
                {
                  speaker: 'sdr',
                  line: 'Perfect, [day] at [time]. I\u2019ll send a calendar invite now. Anything specific you want me to dig into?',
                  note: 'If they sound keen, add: \u201cAnd if you like what you see, we do a free proof of concept \u2014 live in under 3 minutes.\u201d',
                },
              ],
            },
          ],
          objections: [
            {
              trigger: 'Interesting but we\u2019re fine with our current setup',
              response:
                'Totally fair. Was there anything about the milk carton that surprised you \u2014 the idea that Klaviyo can only see a fraction of your visitors?',
              followUp:
                'If the \u201c8 strangers\u201d thing is happening, you\u2019re leaving revenue on the table every day. Worth 20 minutes to see the scale?',
            },
            {
              trigger: 'Don\u2019t have time for a demo',
              response:
                'Completely understand. It\u2019s 20 minutes and I\u2019ll show you your own data, not a generic deck. Most people say it\u2019s the most useful 20 minutes they\u2019ve had.',
              followUp:
                'What does your diary look like next week? I\u2019ll work around you.',
            },
            {
              trigger: 'We\u2019ve looked at this kind of thing before',
              response:
                'Oh interesting \u2014 what did you look at? A lot has changed with cookie deprecation. AI Connect works differently because it plugs directly into your existing Klaviyo flows.',
              followUp:
                'Would it be worth seeing what\u2019s changed? The free proof of concept takes 3 minutes to set up.',
            },
            {
              trigger: 'Send me more info',
              response:
                'Happy to. You\u2019ve already seen the milk carton and emails though \u2014 that\u2019s the best summary we\u2019ve got. What would a new email tell you that a quick call wouldn\u2019t?',
              followUp:
                'I\u2019d rather show you your own data than send you someone else\u2019s. How about 20 minutes next week?',
            },
          ],
        },
      ],
    },
  ],
};
