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
                'Reference the pink milk carton up front. Get permission to take a couple of minutes to explain the technical issue.',
              lines: [
                {
                  speaker: 'sdr',
                  line: 'Hi [Name], it\u2019s [Your name] from Salesfire. We sent you something a bit different recently \u2014 that pink milk carton with the missing person on it. Did you get it?',
                },
                {
                  speaker: 'prospect',
                  line: '[Responds]',
                  note: 'If yes, lean in. If vague, briefly explain the carton concept.',
                },
                {
                  speaker: 'sdr',
                  line: 'Brilliant. So the reason we sent it is we\u2019ve been speaking to loads of Klaviyo users recently, and there\u2019s this technical issue that basically every retailer has but doesn\u2019t know about. Can I take a couple of minutes to explain what I mean?',
                },
              ],
            },
            {
              format: 'verbatim',
              title: 'Discovery',
              instruction:
                'Use a concrete example to make the gap tangible. Mirror whatever they say \u2014 let them talk, the more they share, the stronger your close.',
              lines: [
                {
                  speaker: 'sdr',
                  line: 'Right, so when you look at your website analytics \u2014 let\u2019s say you had 1,000 visitors yesterday \u2014 how many of those do you reckon actually made it into your browse abandonment flow in Klaviyo?',
                },
                {
                  speaker: 'prospect',
                  line: '[Responds]',
                  note: 'Mirror whatever they say. Let them talk \u2014 the more they share, the stronger your close.',
                },
                {
                  speaker: 'sdr',
                  line: 'Right, so would it be useful if I explained why that happens?',
                },
                {
                  speaker: 'prospect',
                  line: '[Usually says yes]',
                },
              ],
            },
            {
              format: 'verbatim',
              title: 'Problem + Cross-Device + Skipped Flows',
              instruction:
                'Use the Currys analogy to make the cookie problem concrete. Then layer on cross-device and skipped flows to build the full picture.',
              lines: [
                {
                  speaker: 'sdr',
                  line: 'Right, so imagine you walk into Currys, and the sales assistant helps you look at TVs. You say you\u2019ll think about it and leave. Next week, you come back, but there\u2019s a different assistant on. They\u2019ve got no clue you were interested in that 55-inch Samsung, so they start from scratch.',
                },
                {
                  speaker: 'sdr',
                  line: 'That\u2019s Klaviyo in a nutshell. Someone visits your site 8 times, but cookies expire, so Klaviyo treats them like 8 different strangers every time. Mental, isn\u2019t it?',
                },
                {
                  speaker: 'prospect',
                  line: '[Responds]',
                },
                {
                  speaker: 'sdr',
                  line: 'And if someone browses on their phone during lunch, then switches to their laptop at home \u2014 boom. Klaviyo thinks that\u2019s two completely different people. The laptop visitor never gets your abandonment emails because Klaviyo doesn\u2019t know they\u2019re the same person who was browsing on mobile.',
                },
                {
                  speaker: 'sdr',
                  line: 'Have you noticed your abandonment emails aren\u2019t catching everyone and often being skipped?',
                },
                {
                  speaker: 'prospect',
                  line: '[Responds]',
                },
                {
                  speaker: 'sdr',
                  line: 'When you look at your flow analytics in Klaviyo, you\u2019ll see loads of emails getting skipped, yeah? But here\u2019s the thing \u2014 those anonymous visitors crossing devices, and outside of cookie windows? They don\u2019t even make it into the flow to be skipped. They\u2019re completely invisible to Klaviyo.',
                },
              ],
            },
            {
              format: 'verbatim',
              title: 'Value Discovery',
              instruction:
                'Get the prospect to quantify the opportunity in their own words. Whatever number or outcome they give becomes the value you\u2019re offering in the close.',
              lines: [
                {
                  speaker: 'sdr',
                  line: 'Quick question \u2014 if you could double your current browse and cart abandonment performance without changing a single email, what would that mean for your targets this year?',
                },
                {
                  speaker: 'prospect',
                  line: '[Responds]',
                  note: 'Get their answer \u2014 use their words in the close.',
                },
              ],
            },
            {
              format: 'verbatim',
              title: 'Social Proof + Anchor',
              instruction:
                'Use a retailer quote to build credibility. Then mirror their earlier words back to confirm the problem before moving to the close.',
              lines: [
                {
                  speaker: 'sdr',
                  line: 'We\u2019ve been working with other [their type] retailers, and one MD said to me, \u2018[Your Name], I thought my abandonment flows were broken \u2014 turns out I was only seeing 30% of the people who should have been in there.\u2019',
                },
                {
                  speaker: 'sdr',
                  line: 'Based on what you\u2019re telling me, the main issue is [mirror their words from earlier] \u2014 fair?',
                },
                {
                  speaker: 'prospect',
                  line: '[Confirms / clarifies]',
                },
              ],
            },
            {
              format: 'verbatim',
              title: 'Close',
              instruction:
                'Pitch the BDM demo with urgency. Introduce the colleague by name, position it as personalised, and add the free POC offer.',
              lines: [
                {
                  speaker: 'sdr',
                  line: 'Look, this is exactly what [BDM name] deals with every day. Our AI Connect typically recovers 200% more revenue through the same Klaviyo flows you\u2019re already running.',
                },
                {
                  speaker: 'sdr',
                  line: 'The thing is, the longer retailers sit on this, the more of those invisible visitors just keep slipping through the cracks. Let\u2019s get [BDM name] to walk through your numbers \u2014 how\u2019s [day] at [time]?',
                },
                {
                  speaker: 'prospect',
                  line: '[Responds]',
                },
                {
                  speaker: 'sdr',
                  line: 'My colleague [BDM name] is brilliant at this stuff \u2014 he can show you exactly what\u2019s happening with your specific setup. And if you like what you see, we do a free proof of concept \u2014 live in under 3 minutes.',
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
