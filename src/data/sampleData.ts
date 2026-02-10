import { DashboardData, SDRInfo, Playbook, RadarScores } from '@/types';

export const sdrList: SDRInfo[] = [
  {
    name: 'Katie Simpson',
    slug: 'katie',
    email: 'katie.simpson@salesfire.com',
    hubspotOwnerId: 79353482,
    bdName: 'Russell Westgarth',
    bdEmail: 'russell.westgarth@salesfire.com',
    bdHubspotOwnerId: 1545993649,
  },
  {
    name: 'Sally Watson',
    slug: 'sally',
    email: 'sally.watson@salesfire.co.uk',
    hubspotOwnerId: 34452385,
    bdName: 'Charlie Butlin',
    bdEmail: 'charlie.butlin@salesfire.com',
    bdHubspotOwnerId: 189350186,
  },
  {
    name: 'Jack Skeldon',
    slug: 'jack',
    email: 'jack.skeldon@salesfire.com',
    hubspotOwnerId: 192524366,
    bdName: 'Kev Gordon',
    bdEmail: 'kev.gordon@salesfire.com',
    bdHubspotOwnerId: 31438116,
  },
  {
    name: 'Stephanie McCarthy',
    slug: 'steph',
    email: 'stephanie.mccarthy@salesfire.com',
    hubspotOwnerId: 91666198,
    bdName: 'Ashleigh Marr',
    bdEmail: 'ashleigh.marr@salesfire.com',
    bdHubspotOwnerId: 239334762,
  },
];

export const playbook: Playbook = {
  whyConnections: [
    {
      feature: "We identify visitors across devices",
      why: "So when someone browses on mobile and comes back on desktop, most platforms lose them. You've got abandoned browse emails set up to catch them - but they're not reaching these people. We fix that."
    },
    {
      feature: "We work outside the cookie window",
      why: "Safari and iOS kill cookies after 7 days. Someone browses Monday, comes back next Tuesday - your email platform can't see them. That's revenue you're set up to capture but can't."
    },
    {
      feature: "Our search influences up to 27% of revenue",
      why: "Think about it - when someone searches on your site, they're telling you exactly what they want. Most site searches just show a list. Ours learns what converts and surfaces those products first."
    },
    {
      feature: "We're seeing 200% more revenue recovered",
      why: "That's not new revenue - it's from flows you've already built. Same emails, same automations, just reaching people who were invisible before."
    },
    {
      feature: "We integrate directly with Klaviyo",
      why: "All those abandoned cart and browse flows you've built? They're only reaching people Klaviyo can identify. We pass back the ones they can't see - same flows, more sends, more revenue."
    },
    {
      feature: "Visually similar recommendations",
      why: "When someone looks at a product that's out of stock or not quite right, instead of losing them, we show items that look similar. Keeps them on site and converts that interest into a sale."
    }
  ],
  objectionResponses: [
    {
      objection: "Send me an email",
      response: "Absolutely. So I send you something relevant - what's the one thing that would make you open it?",
      followUp: "Would a 15-min call be easier? I can show you the gap in real-time."
    },
    {
      objection: "We already have something similar",
      response: "What specifically does [their tool] do for your email flows?",
      followUp: "Let them discover the gap"
    },
    {
      objection: "Not interested right now",
      response: "Fair enough. Quick question - are you happy with what you're seeing from your current setup versus your site traffic?"
    },
    {
      objection: "We're cutting budget",
      response: "Makes sense. Worth knowing - this isn't additional spend, it's recovering revenue from tools you're already paying for."
    },
    {
      objection: "We only sell [single product category]",
      response: "That's actually the sweet spot. You're not personalising products - you're catching people your current setup can't see."
    },
    {
      objection: "Klaviyo/our ESP works fine",
      response: "Good to hear. When you compare your site traffic to your flow sends, do the numbers add up?"
    },
    {
      objection: "We've built something internally",
      response: "Interesting - what does it track specifically? Cross-device? Outside the cookie window?",
      followUp: "Find the gap"
    },
    {
      objection: "We're too small for this",
      response: "Actually, smaller stores often see the biggest percentage gains. You don't need huge traffic - you need to capture more of what you've got."
    }
  ],
  caseStudies: [
    { sector: "Fashion / Footwear", client: "Moda in Pelle", result: "281% more abandoned flow revenue", product: "AI Connect" },
    { sector: "Fashion / Footwear", client: "Charles Clinkard", result: "95% increase in email flow revenue", product: "AI Connect" },
    { sector: "Premium / Considered", client: "Fashion Eyewear", result: "321% more from email flows", product: "AI Connect" },
    { sector: "Sports / Niche", client: "Direct Soccer", result: "330% more daily flow revenue", product: "AI Connect" },
    { sector: "General Retail", client: "Moss", result: "27% of revenue influenced", product: "Search" },
    { sector: "Fashion", client: "Stuarts London", result: "8.19% conversion uplift", product: "Visually Similar" },
    { sector: "Bedding / Furniture", client: "Happy Beds", result: "7.9% increase in AOV", product: "Overlays" },
    { sector: "Sports", client: "SportsShoes", result: "7% uplift in AOV", product: "Overlays" },
    { sector: "Food & Drink", client: "Godiva", result: "241% increase in email subscribers", product: "Data Capture" },
    { sector: "Outdoor / Retail", client: "LD Mountain Centre", result: "5.6x subscriber increase, 6% conversion uplift", product: "Full Suite" }
  ]
};

export const getSampleDataForSDR = (slug: string, date: string): DashboardData | null => {
  const sdr = sdrList.find(s => s.slug === slug);
  if (!sdr) return null;

  // Generate different data based on SDR
  const allTimeRadarVariants: Record<string, RadarScores> = {
    katie: { gatekeeper: 7.2, opener: 6.5, personalisation: 5.9, discovery: 6.7, callControl: 5.9, toneEnergy: 6.7, valueProp: 5.5, objections: 5.8, close: 6.3 },
    sally: { gatekeeper: 7.3, opener: 6.8, personalisation: 6.1, discovery: 6.6, callControl: 6.3, toneEnergy: 6.7, valueProp: 6.3, objections: 6.1, close: 5.8 },
    jack: { gatekeeper: 7.1, opener: 6.9, personalisation: 6.4, discovery: 7.1, callControl: 6.6, toneEnergy: 6.9, valueProp: 6.4, objections: 6.2, close: 6.4 },
    steph: { gatekeeper: 6.5, opener: 6.3, personalisation: 5.7, discovery: 5.9, callControl: 5.5, toneEnergy: 6.1, valueProp: 6.1, objections: 5.9, close: 5.9 },
  };

  const dataVariants: Record<string, Partial<DashboardData>> = {
    katie: {
      dailyStats: { totalDials: 45, connectedCalls: 8, connectionRate: 17.8 },
      focusToday: {
        instruction: "When a prospect mentions their current tool, pause and ask: 'What specifically does it do for your email flows?'"
      },
      yesterdaysCalls: [
        {
          id: 'k1',
          company: 'Babyblooms',
          prospect: 'Lisa',
          date: '2026-02-02',
          duration: '4:32',
          outcome: 'email',
          overall: 5.7,
          insight: 'Lisa connected the WHY herself about corporate orders - missed opportunity to build on it'
        },
        {
          id: 'k2',
          company: 'Raj Karna',
          prospect: 'Raj',
          date: '2026-02-02',
          duration: '5:18',
          outcome: 'demo',
          overall: 7.0,
          insight: 'Great discovery questions - Raj opened up about their Nosto challenges'
        },
        {
          id: 'k3',
          company: 'Grant Kiddle Jewellery',
          prospect: 'Grant',
          date: '2026-02-02',
          duration: '6:45',
          outcome: 'not_interested',
          overall: 5.2,
          insight: 'Grant said "feels like duplicate" 3 times - need to dig into specifics next time'
        },
        {
          id: 'k4',
          company: 'Urban Outfitters UK',
          prospect: 'Emma',
          date: '2026-02-02',
          duration: '8:12',
          outcome: 'demo',
          overall: 7.5,
          insight: 'Excellent close - asked for specific time and confirmed decision makers'
        },
        {
          id: 'k5',
          company: 'Boden',
          prospect: 'Sarah',
          date: '2026-02-02',
          duration: '5:01',
          outcome: 'warm_lead',
          overall: 6.2,
          insight: 'Sarah interested but needs to check with marketing lead - follow up scheduled'
        }
      ],
      weeklyData: {
        weekNumber: 5,
        callsReviewed: 5,
        demosBooked: 3,
        demoChange: 2,
        avgOverall: 6.5,
        overallChange: 0.6,
        avgFocusArea: 5.2,
        focusAreaChange: 0.7,
        focusAreaName: 'Value Prop',
        calls: [
          {
            id: 'k1',
            company: 'Raj Karna',
            prospect: 'Raj',
            date: '2026-02-02',
            duration: '5:18',
            outcome: 'demo',
            overall: 7.0,
            insight: 'Strong close after good discovery',
            scores: { gatekeeper: 'N/A', opener: 7, personalisation: 6, discovery: 7, callControl: 6, toneEnergy: 7, valueProp: 6, objections: 'N/A', close: 8 },
            metrics: {
              talkTime: 72,
              talkSpeed: 142,
              monologue: 38,
              customerStory: 25,
              patience: 1.2,
            },
            areaBreakdown: {
              opener: {
                score: 7,
                why: 'Confident intro that got Raj talking within the first 30 seconds.',
                well: 'Used a natural, conversational tone right from the start - Raj felt comfortable quickly.',
                improve: 'Could have referenced something specific about Raj Karna\'s site to show you\'d done your homework.',
                tryNext: 'Before your next call, pull up their homepage and mention one specific product category or campaign they\'re running.',
              },
              personalisation: {
                score: 6,
                why: 'Some generic references to ecommerce but nothing Raj Karna-specific.',
                well: 'Asked about their current tech stack which showed genuine interest.',
                improve: 'Didn\'t reference anything about their brand, products, or recent activity.',
                tryNext: 'Check their site for 5 minutes before calling - find one thing you can mention that shows you know who they are.',
              },
              discovery: {
                score: 7,
                why: 'Good questions that got Raj to open up about Nosto frustrations.',
                well: 'The question about what Nosto actually does for them was spot on - Raj started thinking about the gaps.',
                improve: 'Talk time was 72% which means Raj didn\'t get enough airtime to fully explain his problems.',
                tryNext: 'After asking a question, count to 3 before speaking. Let Raj fill the silence.',
              },
              callControl: {
                score: 6,
                why: 'Call moved forward but you were doing most of the driving.',
                well: 'Kept the conversation on track and moved logically from discovery to value.',
                improve: 'Could have let Raj lead more - he was starting to connect the dots himself.',
                tryNext: 'Try asking "what would that mean for you?" after each key point and let Raj do the math.',
              },
              toneEnergy: {
                score: 7,
                why: 'Good energy throughout - matched Raj\'s calmer style without losing enthusiasm.',
                well: 'Didn\'t oversell or sound scripted - came across as genuinely interested.',
                improve: 'Could dial up energy slightly when Raj showed interest to build momentum.',
                tryNext: 'When you hear excitement in their voice, match it - lean in with your tone.',
              },
              valueProp: {
                score: 6,
                why: 'Connected cross-device tracking to their situation but could have gone deeper.',
                well: 'The "what would that mean for you guys?" question was brilliant - that\'s the right instinct.',
                improve: 'Didn\'t tie it back to specific revenue numbers or their Nosto limitations.',
                tryNext: 'After explaining a feature, ask "how many visitors do you think you\'re losing to cookie expiry?" - make it concrete.',
              },
              close: {
                score: 8,
                why: 'Strong close - asked for a specific time and confirmed who needs to be there.',
                well: 'Didn\'t hesitate to ask for the demo - confident and direct.',
                improve: 'Could have confirmed the agenda for the demo so Raj knows what to expect.',
                tryNext: 'When booking, say "I\'ll show you exactly where those visitors are dropping off - bring whoever handles your Klaviyo flows."',
              },
            },
            keyMoment: "Asked 'What would that mean for you guys?' - the value prop connection clicking",
            improvement: "High talk time (72%) - let Raj talk more even though he was quiet"
          },
          {
            id: 'k2',
            company: 'Grant Kiddle Jewellery',
            prospect: 'Grant',
            date: '2026-02-02',
            duration: '6:45',
            outcome: 'not_interested',
            overall: 5.2,
            insight: 'Kept explaining features instead of asking questions',
            scores: { gatekeeper: 'N/A', opener: 6, personalisation: 5, discovery: 5, callControl: 5, toneEnergy: 6, valueProp: 4, objections: 5, close: 5 },
            metrics: {
              talkTime: 68,
              talkSpeed: 155,
              monologue: 52,
              customerStory: 15,
              patience: -0.8,
            },
            areaBreakdown: {
              opener: {
                score: 6,
                why: 'Decent opening but didn\'t hook Grant quickly enough - he was skeptical from the start.',
                well: 'Friendly tone and got past the initial "who is this?" moment.',
                improve: 'Didn\'t give Grant a reason to stay on the line in the first 15 seconds.',
                tryNext: 'Lead with something specific to jewellery ecommerce - "I noticed you\'re running abandoned cart flows on your site" gets their attention.',
              },
              personalisation: {
                score: 5,
                why: 'Nothing specific to Grant Kiddle\'s jewellery business or their unique challenges.',
                well: 'Mentioned ecommerce generally which at least showed some context.',
                improve: 'Jewellery is a high-AOV, considered purchase - that changes everything about how you position Salesfire.',
                tryNext: 'Before calling jewellery brands, think about how cross-device tracking matters when people browse rings on mobile but buy on desktop.',
              },
              discovery: {
                score: 5,
                why: 'Grant said "feels like duplicate" three times and you kept explaining instead of asking.',
                well: 'You tried to uncover his current setup which was the right instinct.',
                improve: 'When someone repeats an objection, they\'re telling you they don\'t feel heard. Stop and ask.',
                tryNext: 'Next time someone says "we already have that" - immediately ask "what specifically does it do for your email flows?" Let them discover the gap.',
              },
              callControl: {
                score: 5,
                why: 'Grant was leading the call and you were reacting rather than guiding.',
                well: 'Stayed calm when Grant pushed back which shows good composure.',
                improve: 'Lost control when Grant kept objecting - fell into defence mode.',
                tryNext: 'When you feel yourself defending, pause and ask a question instead. Questions give you control back.',
              },
              toneEnergy: {
                score: 6,
                why: 'Energy was okay but dropped when Grant got dismissive.',
                well: 'Started with good energy and didn\'t get confrontational.',
                improve: 'Voice got quieter and faster when Grant pushed back - that signals you\'re not confident.',
                tryNext: 'Practice keeping your pace steady when you get pushback. Slow down, not speed up.',
              },
              valueProp: {
                score: 4,
                why: 'Kept listing features instead of connecting them to Grant\'s jewellery business.',
                well: 'Mentioned Klaviyo integration which briefly caught Grant\'s interest.',
                improve: 'Grant doesn\'t care about features - he cares about revenue he\'s missing from high-value jewellery purchases.',
                tryNext: 'For Grant Kiddle specifically: "Your average order is probably over 100 quid - how many of those browsers are you losing because Safari killed the cookie?"',
              },
              objections: {
                score: 5,
                why: 'Responded to "feels like duplicate" by explaining more features - that\'s the opposite of what works.',
                well: 'Didn\'t give up when Grant objected - showed persistence.',
                improve: 'Persistence without curiosity just sounds pushy. You need to understand his objection before you can handle it.',
                tryNext: 'When Grant says "feels like duplicate" - say "I hear that a lot. What specifically does your current setup handle for cross-device tracking?"',
              },
              close: {
                score: 5,
                why: 'Didn\'t attempt a close because the conversation never got to that point.',
                well: 'Recognised that pushing for a demo would have been tone-deaf given where the conversation was.',
                improve: 'Even on tough calls, always try for a next step - even if it\'s just a follow-up call.',
                tryNext: 'If the call isn\'t going well, try: "Look Grant, I don\'t want to waste your time. Can I send you one thing that shows what I mean? If it resonates, we talk. If not, no worries."',
              },
            },
            keyMoment: "Grant showed interest when mentioning Klaviyo integration",
            improvement: "When Grant said 'feels like duplicate' - should have asked 'what specifically does your current tool do for email flows?'"
          },
          {
            id: 'k3',
            company: 'Urban Outfitters UK',
            prospect: 'Emma',
            date: '2026-02-01',
            duration: '8:12',
            outcome: 'demo',
            overall: 7.5,
            insight: 'Great use of case studies and confident close',
            scores: { gatekeeper: 8, opener: 7, personalisation: 7, discovery: 8, callControl: 7, toneEnergy: 8, valueProp: 7, objections: 7, close: 8 },
            metrics: {
              talkTime: 48,
              talkSpeed: 138,
              monologue: 28,
              customerStory: 65,
              patience: 2.5,
            },
            keyMoment: "Connected Moda in Pelle case study to Emma's fashion context perfectly",
            improvement: "Could have asked one more question before moving to close"
          },
          {
            id: 'k4',
            company: 'Babyblooms',
            prospect: 'Lisa',
            date: '2026-01-31',
            duration: '4:32',
            outcome: 'email',
            overall: 5.7,
            insight: 'Lisa did the WHY connection herself - missed chance to reinforce',
            scores: { gatekeeper: 'N/A', opener: 6, personalisation: 5, discovery: 6, callControl: 5, toneEnergy: 6, valueProp: 5, objections: 'N/A', close: 5 },
            keyMoment: "Lisa mentioned corporate gifting challenge - good discovery",
            improvement: "When Lisa said 'that would help with corporate orders' - should have built on that instead of moving on"
          },
          {
            id: 'k5',
            company: 'Boden',
            prospect: 'Sarah',
            date: '2026-01-30',
            duration: '5:01',
            outcome: 'warm_lead',
            overall: 6.2,
            insight: 'Good rapport but lost control at the end',
            scores: { gatekeeper: 7, opener: 6, personalisation: 6, discovery: 7, callControl: 6, toneEnergy: 6, valueProp: 5, objections: 6, close: 5 },
            keyMoment: "Good question about their current Klaviyo setup",
            improvement: "Should have asked who else needs to be in the meeting instead of accepting 'I'll check'"
          }
        ],
        radarScores: { gatekeeper: 7.5, opener: 6.4, personalisation: 5.8, discovery: 6.6, callControl: 5.8, toneEnergy: 6.6, valueProp: 5.4, objections: 6.0, close: 6.2 },
        progressData: [
          { week: 2, overall: 5.5, focusArea: 4.2, close: 5.0 },
          { week: 3, overall: 5.7, focusArea: 4.5, close: 5.2 },
          { week: 4, overall: 5.9, focusArea: 4.8, close: 5.8 },
          { week: 5, overall: 6.5, focusArea: 5.4, close: 6.2 }
        ],
        weekFocus: {
          title: "Handling 'we already have something similar'",
          triggers: ["We've got Nosto", "Feels like duplicate", "We built something internally"],
          dont: "Explain how Salesfire is different",
          do: "Ask 'What specifically does [tool] do for your email flows?'",
          example: {
            context: "Grant Kiddle said 'feels like duplicate' 3 times. Katie kept explaining features instead of pausing.",
            couldHaveSaid: "I hear that a lot - what specifically does Nosto handle for your Klaviyo abandonment flows?"
          }
        }
      }
    },
    sally: {
      dailyStats: { totalDials: 52, connectedCalls: 9, connectionRate: 17.3 },
      focusToday: {
        instruction: "After explaining a feature, immediately ask: 'What would that mean for your team specifically?'"
      },
      yesterdaysCalls: [
        {
          id: 's1',
          company: 'Seasalt Cornwall',
          prospect: 'Mark',
          date: '2026-02-02',
          duration: '6:15',
          outcome: 'demo',
          overall: 7.2,
          insight: 'Excellent gatekeeper navigation and strong WHY connection on cross-device tracking'
        },
        {
          id: 's2',
          company: 'JD Williams',
          prospect: 'Rachel',
          date: '2026-02-02',
          duration: '5:45',
          outcome: 'email',
          overall: 6.0,
          insight: 'Good discovery but settled for email too easily when Rachel hesitated'
        },
        {
          id: 's3',
          company: 'Mountain Warehouse',
          prospect: 'James',
          date: '2026-02-02',
          duration: '7:30',
          outcome: 'demo',
          overall: 7.8,
          insight: 'Perfect handling of "we already have Nosto" - asked the right follow-up questions'
        }
      ],
      weeklyData: {
        weekNumber: 5,
        callsReviewed: 4,
        demosBooked: 2,
        demoChange: 1,
        avgOverall: 6.8,
        overallChange: 0.4,
        avgFocusArea: 6.2,
        focusAreaChange: 0.5,
        focusAreaName: 'Close',
        calls: [
          {
            id: 's1',
            company: 'Seasalt Cornwall',
            prospect: 'Mark',
            date: '2026-02-02',
            duration: '6:15',
            outcome: 'demo',
            overall: 7.2,
            insight: 'Strong gatekeeper work and good WHY',
            scores: { gatekeeper: 8, opener: 7, personalisation: 7, discovery: 7, callControl: 7, toneEnergy: 7, valueProp: 7, objections: 'N/A', close: 7 },
            metrics: {
              talkTime: 45,
              talkSpeed: 136,
              monologue: 30,
              customerStory: 55,
              patience: 2.1,
            },
            areaBreakdown: {
              gatekeeper: {
                score: 8,
                why: 'Navigated the gatekeeper smoothly and confidently - got through to Mark on the first attempt.',
                well: 'Used a warm, familiar tone that didn\'t trigger the "sales call" alarm for the gatekeeper.',
                improve: 'Could have name-dropped a bit more naturally to sound like an expected call.',
                tryNext: 'Try "Hi, it\'s Sally for Mark - he\'s expecting my call about their email setup" even on cold calls. Confidence gets you through.',
              },
              opener: {
                score: 7,
                why: 'Strong opening that immediately referenced Seasalt\'s mobile-heavy customer base.',
                well: 'Showed you\'d done research on Seasalt - Mark noticed and it built instant credibility.',
                improve: 'Could have been slightly more specific about what you noticed on their site.',
                tryNext: 'Next time, mention a specific abandoned browse flow or product page you saw - "I was on your site and noticed your knitwear collection page..."',
              },
              personalisation: {
                score: 7,
                why: 'Referenced Seasalt\'s Cornwall heritage and their mobile-first audience which felt genuine.',
                well: 'Connected their brand story to why cross-device tracking matters for their specific audience.',
                improve: 'Could have referenced their Klaviyo setup more specifically.',
                tryNext: 'If you can see they use Klaviyo, mention it: "I noticed you\'re running Klaviyo - are your abandoned browse flows hitting the numbers you expected?"',
              },
              discovery: {
                score: 7,
                why: 'Good questions that uncovered Mark\'s frustration with email flow performance.',
                well: 'Asked about their mobile vs desktop conversion gap - that\'s exactly the right angle for Seasalt.',
                improve: 'Could have dug deeper when Mark mentioned their email open rates were dropping.',
                tryNext: 'When someone mentions declining metrics, ask "what do you think is causing that?" - let them diagnose the problem.',
              },
              callControl: {
                score: 7,
                why: 'Kept the conversation moving naturally from discovery to value without it feeling forced.',
                well: 'Good transitions between topics - the call had a logical flow.',
                improve: 'Let the conversation drift slightly when Mark went on a tangent about their Cornwall stores.',
                tryNext: 'When the conversation drifts, gently redirect: "That\'s really interesting - and it connects to something I wanted to ask about your online side..."',
              },
              toneEnergy: {
                score: 7,
                why: 'Warm and genuine throughout - matched Mark\'s friendly, laid-back style.',
                well: 'Didn\'t oversell or sound corporate - came across as someone who genuinely wanted to help.',
                improve: 'Energy could have picked up slightly when presenting the value prop to create momentum.',
                tryNext: 'When you get to the good stuff, let your voice show it. A slight increase in pace and enthusiasm signals "this is the important bit."',
              },
              valueProp: {
                score: 7,
                why: 'Connected cross-device tracking brilliantly to their mobile-first customer base.',
                well: 'The link between Seasalt\'s mobile browsing audience and invisible visitors was perfect.',
                improve: 'Could have used a specific number or case study to make it more tangible.',
                tryNext: 'Try: "Brands like Seasalt with heavy mobile traffic typically see 30-40% of their visitors invisible to Klaviyo. What would recovering even half of those mean?"',
              },
              close: {
                score: 7,
                why: 'Got the demo but settled for "sometime next week" instead of pinning down a specific slot.',
                well: 'Asked for the demo confidently and Mark agreed without hesitation.',
                improve: 'Vague timing means more back-and-forth and higher risk of it falling through.',
                tryNext: 'Always offer two specific times: "How\'s Tuesday at 2 or Wednesday at 10?" It\'s easier to pick than to figure out availability.',
              },
            },
            keyMoment: "Connected cross-device tracking to their mobile-first customer base brilliantly",
            improvement: "Could have pushed for a specific demo time instead of 'sometime next week'"
          },
          {
            id: 's2',
            company: 'JD Williams',
            prospect: 'Rachel',
            date: '2026-02-02',
            duration: '5:45',
            outcome: 'email',
            overall: 6.0,
            insight: 'Settled for email when could have pushed',
            scores: { gatekeeper: 'N/A', opener: 6, personalisation: 6, discovery: 7, callControl: 6, toneEnergy: 6, valueProp: 6, objections: 5, close: 5 },
            metrics: {
              talkTime: 58,
              talkSpeed: 148,
              monologue: 42,
              customerStory: 30,
              patience: 0.5,
            },
            areaBreakdown: {
              opener: {
                score: 6,
                why: 'Functional opener but didn\'t grab Rachel\'s attention fast enough.',
                well: 'Got through the introduction smoothly and Rachel stayed on the line.',
                improve: 'JD Williams is a big brand - you need a stronger hook to stand out from the 20 sales calls they get daily.',
                tryNext: 'For larger brands, lead with a bold statement: "We\'re seeing your competitors recover 200% more from their existing email flows - wanted to see if you\'re seeing the same gap."',
              },
              personalisation: {
                score: 6,
                why: 'Mentioned their ecommerce presence but nothing specific to JD Williams or the N Brown Group.',
                well: 'Referenced their email marketing setup which showed some awareness.',
                improve: 'JD Williams targets an older demographic who are more likely to browse on one device and buy on another - that\'s your angle.',
                tryNext: 'Research their customer demographic before calling: "Your customers tend to research on mobile and come back on desktop - that\'s exactly where most platforms lose them."',
              },
              discovery: {
                score: 7,
                why: 'Good question about their Klaviyo abandoned cart performance - that\'s exactly the right thread to pull.',
                well: 'Got Rachel talking about their email flow metrics which opened up the conversation.',
                improve: 'Could have gone deeper when Rachel shared their numbers - missed a chance to quantify the gap.',
                tryNext: 'When they share metrics, do the maths with them: "So you\'re sending to X per month from Y visitors? That means Z% are invisible. What would reaching even half of those mean?"',
              },
              callControl: {
                score: 6,
                why: 'Lost control when Rachel said "send me something" - accepted it too quickly.',
                well: 'The first half of the call was well-structured and flowing naturally.',
                improve: 'When Rachel hit the brakes, you stopped pushing entirely. There\'s a middle ground between pushy and passive.',
                tryNext: 'When someone says "send me an email", don\'t accept it immediately. Try: "Happy to - so I send you something relevant, what\'s the one thing that would make you open it?"',
              },
              toneEnergy: {
                score: 6,
                why: 'Started well but energy dropped after Rachel\'s brush-off.',
                well: 'Professional and warm throughout - Rachel seemed comfortable talking to you.',
                improve: 'Your enthusiasm visibly dipped when Rachel pulled back. That signals defeat.',
                tryNext: 'Practice keeping your energy level steady even when you get a "no" signal. Stay warm and curious, not deflated.',
              },
              valueProp: {
                score: 6,
                why: 'Explained what Salesfire does but didn\'t connect it specifically to JD Williams\' revenue.',
                well: 'Mentioned the Klaviyo integration which is directly relevant to their setup.',
                improve: 'Rachel needed to see a specific number to stay interested. Generic value props don\'t cut it with senior people.',
                tryNext: 'Prepare a one-liner with a number: "Brands your size typically have 60-70% of site visitors invisible to Klaviyo. We make them visible. Same flows, more sends, more revenue."',
              },
              objections: {
                score: 5,
                why: 'Rachel\'s "send me something" was a soft objection and you didn\'t challenge it at all.',
                well: 'Stayed polite and didn\'t burn the bridge - Rachel will likely read your email.',
                improve: '"Send me an email" is almost never genuine interest - it\'s a polite brush-off. You need a response ready.',
                tryNext: 'Drill this response until it\'s automatic: "Absolutely. So I send you something relevant - what\'s the one thing that would make you open it?"',
              },
              close: {
                score: 5,
                why: 'Settled for an email send when there was still room to push for more.',
                well: 'At least secured a way to follow up rather than ending with nothing.',
                improve: 'An email follow-up has maybe a 10% chance of converting. A scheduled call has 60%+.',
                tryNext: 'Even if they insist on email, try: "I\'ll send that over. Can I also book a 10-minute slot next week to walk you through it? If the email doesn\'t grab you, we cancel."',
              },
            },
            keyMoment: "Good question about their Klaviyo abandoned cart performance",
            improvement: "When Rachel said 'send me something' - should have asked 'what specifically would make you want to take a call?'"
          },
          {
            id: 's3',
            company: 'Mountain Warehouse',
            prospect: 'James',
            date: '2026-01-31',
            duration: '7:30',
            outcome: 'demo',
            overall: 7.8,
            insight: 'Textbook handling of competitor objection',
            scores: { gatekeeper: 7, opener: 8, personalisation: 7, discovery: 8, callControl: 8, toneEnergy: 8, valueProp: 8, objections: 8, close: 7 },
            metrics: {
              talkTime: 42,
              talkSpeed: 132,
              monologue: 25,
              customerStory: 78,
              patience: 3.2,
            },
            keyMoment: "When James said 'we have Nosto', Sally asked 'what does it do for your email abandonment flows?' - James realized the gap",
            improvement: "Strong call overall - keep practicing this pattern"
          },
          {
            id: 's4',
            company: 'Crew Clothing',
            prospect: 'Tom',
            date: '2026-01-30',
            duration: '5:20',
            outcome: 'not_interested',
            overall: 5.8,
            insight: 'Good opener but rushed to features too quickly',
            scores: { gatekeeper: 'N/A', opener: 7, personalisation: 5, discovery: 5, callControl: 5, toneEnergy: 6, valueProp: 5, objections: 6, close: 5 },
            keyMoment: "Tom mentioned they just switched ESPs - timing opportunity",
            improvement: "Instead of explaining Salesfire, should have asked 'what prompted the switch?'"
          }
        ],
        radarScores: { gatekeeper: 7.5, opener: 7.0, personalisation: 6.3, discovery: 6.8, callControl: 6.5, toneEnergy: 6.8, valueProp: 6.5, objections: 6.3, close: 6.0 },
        progressData: [
          { week: 2, overall: 5.8, focusArea: 5.0, close: 5.0 },
          { week: 3, overall: 6.2, focusArea: 5.5, close: 5.5 },
          { week: 4, overall: 6.4, focusArea: 5.8, close: 5.8 },
          { week: 5, overall: 6.8, focusArea: 6.2, close: 6.0 }
        ],
        weekFocus: {
          title: "Pushing past 'send me an email'",
          triggers: ["Send me some info", "Email me", "I'll have a look"],
          dont: "Accept the email brush-off without pushback",
          do: "Ask 'What specifically would make you want to open it?'",
          example: {
            context: "Rachel said 'send me something' and Sally moved straight to capturing email without challenging.",
            couldHaveSaid: "Happy to - so I send you something relevant, what's the one thing that would make you open it?"
          }
        }
      }
    },
    jack: {
      dailyStats: { totalDials: 38, connectedCalls: 5, connectionRate: 13.2 },
      focusToday: {
        instruction: "Practice the pause: after the prospect speaks, count to 2 before responding. Let silence do the work."
      },
      yesterdaysCalls: [
        {
          id: 'j1',
          company: 'Fenwick',
          prospect: 'Amanda',
          date: '2026-02-02',
          duration: '9:20',
          outcome: 'demo',
          overall: 8.1,
          insight: 'Exceptional discovery and patience - let Amanda think through the problem herself'
        },
        {
          id: 'j2',
          company: 'Quiz Clothing',
          prospect: 'Dan',
          date: '2026-02-02',
          duration: '5:55',
          outcome: 'warm_lead',
          overall: 6.5,
          insight: 'Good rapport with Dan but could have pushed harder on the WHY'
        },
        {
          id: 'j3',
          company: 'Hobbs',
          prospect: 'Claire',
          date: '2026-02-02',
          duration: '6:10',
          outcome: 'demo',
          overall: 7.3,
          insight: 'Strong objection handling when Claire mentioned budget concerns'
        },
        {
          id: 'j4',
          company: 'Phase Eight',
          prospect: 'Laura',
          date: '2026-02-02',
          duration: '7:45',
          outcome: 'email',
          overall: 6.0,
          insight: 'Laura needed more time - good to not push but could have scheduled a follow-up call'
        }
      ],
      weeklyData: {
        weekNumber: 5,
        callsReviewed: 6,
        demosBooked: 3,
        demoChange: 1,
        avgOverall: 6.9,
        overallChange: 0.8,
        avgFocusArea: 7.2,
        focusAreaChange: 1.1,
        focusAreaName: 'Discovery',
        calls: [
          {
            id: 'j1',
            company: 'Fenwick',
            prospect: 'Amanda',
            date: '2026-02-02',
            duration: '9:20',
            outcome: 'demo',
            overall: 8.1,
            insight: 'Best call this week - patience paid off',
            scores: { gatekeeper: 8, opener: 8, personalisation: 8, discovery: 9, callControl: 8, toneEnergy: 8, valueProp: 8, objections: 'N/A', close: 8 },
            metrics: {
              talkTime: 40,
              talkSpeed: 128,
              monologue: 22,
              customerStory: 90,
              patience: 4.5,
            },
            areaBreakdown: {
              gatekeeper: {
                score: 8,
                why: 'Got through to Amanda at Fenwick cleanly - sounded like a natural, expected call.',
                well: 'Confident and warm when speaking to reception - no hesitation or stumbling.',
                improve: 'Minor point - could have asked for Amanda by her full name and title to sound even more expected.',
                tryNext: 'Keep doing what you\'re doing here. If anything, try adding "she\'ll know what it\'s about" for extra confidence.',
              },
              opener: {
                score: 8,
                why: 'Immediately referenced Fenwick\'s position in premium retail which showed you\'d done your homework.',
                well: 'The opening felt natural and relevant - Amanda was engaged from the first sentence.',
                improve: 'Could have been even more specific about what you\'d seen on Fenwick\'s site.',
                tryNext: 'Try mentioning a specific product page or campaign: "I was looking at your beauty section online and noticed..."',
              },
              personalisation: {
                score: 8,
                why: 'Excellent prep - you clearly knew Fenwick\'s brand positioning and their premium customer base.',
                well: 'Connected their premium audience to considered purchase behaviour - that\'s exactly how cross-device tracking matters for them.',
                improve: 'Could have mentioned a specific competitor in premium retail using Salesfire for an even stronger hook.',
                tryNext: 'Use Moda in Pelle or Fashion Eyewear as the reference point: "We work with Fashion Eyewear who have a similar premium, considered purchase customer..."',
              },
              discovery: {
                score: 9,
                why: 'This was exceptional. You paused after Amanda mentioned cookie challenges and she talked for 90 seconds straight, basically selling herself on the need.',
                well: 'The patience to stay silent while Amanda worked through the problem in her own head was textbook. This is how discovery should feel.',
                improve: 'Honestly not much. If anything, you could have asked one more follow-up to quantify the impact.',
                tryNext: 'After someone talks through their problem like Amanda did, try: "And if you could solve that, what would it mean in terms of monthly revenue?"',
              },
              callControl: {
                score: 8,
                why: 'Brilliant balance - you guided the conversation without forcing it. Amanda felt like she was leading.',
                well: 'Used silence as a control tool. When you stopped talking, Amanda filled the space with exactly the information you needed.',
                improve: 'The call ran 9+ minutes which is fine for a demo booking, but watch for diminishing returns.',
                tryNext: 'Once you\'ve got the commitment, wrap up efficiently. Don\'t risk talking them out of it.',
              },
              toneEnergy: {
                score: 8,
                why: 'Matched Fenwick\'s premium feel - calm, confident, not pushy. Amanda clearly respected the approach.',
                well: 'Your speaking pace was measured and deliberate which signals expertise.',
                improve: 'Could have shown slightly more enthusiasm when Amanda had her lightbulb moment.',
                tryNext: 'When the prospect connects the dots themselves, let your voice reflect that: "Exactly - and that\'s what makes this exciting."',
              },
              valueProp: {
                score: 8,
                why: 'Let Amanda discover the value herself rather than explaining it. That\'s the most powerful form of value delivery.',
                well: 'By asking the right questions, Amanda articulated Salesfire\'s value prop better than you could have.',
                improve: 'Could have reinforced her conclusions with a specific stat or case study.',
                tryNext: 'After they discover the gap, reinforce it: "That\'s exactly right - and Fashion Eyewear saw 321% more from their email flows once we made those visitors visible."',
              },
              close: {
                score: 8,
                why: 'Confident close with a specific time and clear next steps.',
                well: 'Asked who else should be on the demo call - that\'s a detail most SDRs miss.',
                improve: 'Could have confirmed the demo agenda so Amanda can prepare internally.',
                tryNext: 'Send a calendar invite within 5 minutes with a one-line agenda: "I\'ll show you exactly where Fenwick\'s invisible visitors are and what recovering them could mean."',
              },
            },
            keyMoment: "Paused after Amanda mentioned their cookie challenges - she talked for 90 seconds and sold herself on needing to change",
            improvement: "Perfect example of letting silence work - keep doing this"
          },
          {
            id: 'j2',
            company: 'Quiz Clothing',
            prospect: 'Dan',
            date: '2026-02-02',
            duration: '5:55',
            outcome: 'warm_lead',
            overall: 6.5,
            insight: 'Good discovery but WHY connection was weak',
            scores: { gatekeeper: 'N/A', opener: 7, personalisation: 6, discovery: 7, callControl: 6, toneEnergy: 7, valueProp: 5, objections: 6, close: 6 },
            metrics: {
              talkTime: 56,
              talkSpeed: 144,
              monologue: 38,
              customerStory: 35,
              patience: 1.0,
            },
            areaBreakdown: {
              opener: {
                score: 7,
                why: 'Solid opener that got Dan talking - mentioned their fast fashion model which was smart.',
                well: 'Referenced Quiz\'s online growth which showed you\'d looked at the brand beforehand.',
                improve: 'Could have been more specific about what you noticed on their site.',
                tryNext: 'Mention something concrete: "I was on your site and noticed you\'re pushing new arrivals hard - are your browse abandonment flows catching all those visitors?"',
              },
              personalisation: {
                score: 6,
                why: 'Some awareness of Quiz as a fast fashion brand but didn\'t connect it to specific Salesfire value.',
                well: 'Knew they were a growing ecommerce player which gave you credibility.',
                improve: 'Fast fashion = high volume, lower AOV, impulse purchases. That means email flow speed matters even more.',
                tryNext: 'For fast fashion brands, angle it as: "Your products move fast - if someone browses a dress on Monday and your email lands Tuesday, it might be sold out. We catch them in real-time."',
              },
              discovery: {
                score: 7,
                why: 'Dan opened up about the traffic vs conversion gap which is exactly the right thread.',
                well: 'Good instinct to ask about their traffic numbers - Dan clearly wanted to talk about it.',
                improve: 'When Dan shared the gap, you moved to explaining features instead of letting him quantify the problem.',
                tryNext: 'After someone reveals a gap, ask: "What would closing that gap mean for your monthly targets?" Let them do the revenue maths.',
              },
              callControl: {
                score: 6,
                why: 'Started well but lost direction after the discovery phase.',
                well: 'First half of the call was well-paced and structured.',
                improve: 'Transition from discovery to value felt rushed - Dan wasn\'t ready for the pitch yet.',
                tryNext: 'After good discovery, bridge with a question not a statement: "So if we could help with that gap, what would you want to see first?"',
              },
              toneEnergy: {
                score: 7,
                why: 'Good energy and rapport with Dan - the conversation felt natural.',
                well: 'Matched Dan\'s casual, direct style. He seemed to like talking to you.',
                improve: 'Could have used Dan\'s energy when he was excited about the traffic numbers to build towards a close.',
                tryNext: 'When the prospect gets animated about a problem, ride that wave. Don\'t slow down - match their energy and guide it to a next step.',
              },
              valueProp: {
                score: 5,
                why: 'Explained cross-device tracking well but didn\'t connect it to Quiz\'s specific traffic-to-conversion gap.',
                well: 'The technical explanation was clear and Dan understood what Salesfire does.',
                improve: 'Dan already told you his problem. Your value prop should have been his words back to him with Salesfire as the solution.',
                tryNext: 'Try: "You said you\'ve got the traffic but conversion isn\'t matching - that gap is exactly what we close. For Quiz\'s volume, that could be significant."',
              },
              objections: {
                score: 6,
                why: 'Dan didn\'t object hard but you didn\'t pre-empt his concerns either.',
                well: 'Stayed composed and didn\'t oversell when Dan was thinking.',
                improve: 'Could have anticipated Dan\'s "I need to think about it" by addressing it before he raised it.',
                tryNext: 'When you sense hesitation building, address it: "I know this is a lot to think about - what would help you feel confident this is worth 25 minutes?"',
              },
              close: {
                score: 6,
                why: 'Got a warm lead but could have pushed for a proper demo booking.',
                well: 'Secured a follow-up which is better than nothing.',
                improve: 'Dan was interested enough for a demo - the close was too soft.',
                tryNext: 'Instead of "I\'ll follow up next week", try "Let\'s book 25 minutes - I\'ll show you exactly where Quiz is losing those visitors. How\'s Thursday?"',
              },
            },
            keyMoment: "Dan opened up about their traffic vs conversion gap",
            improvement: "After Dan mentioned the gap, should have asked 'what would closing that gap mean for your monthly targets?'"
          },
          {
            id: 'j3',
            company: 'Hobbs',
            prospect: 'Claire',
            date: '2026-02-02',
            duration: '6:10',
            outcome: 'demo',
            overall: 7.3,
            insight: 'Great pivot on budget objection',
            scores: { gatekeeper: 7, opener: 7, personalisation: 7, discovery: 7, callControl: 7, toneEnergy: 7, valueProp: 7, objections: 8, close: 7 },
            metrics: {
              talkTime: 46,
              talkSpeed: 135,
              monologue: 30,
              customerStory: 52,
              patience: 2.8,
            },
            keyMoment: "When Claire said 'we're cutting budget', Jack responded perfectly: 'this isn't additional spend, it's recovering revenue'",
            improvement: "Could have asked about their current recovery rate to make it more concrete"
          },
          {
            id: 'j4',
            company: 'Phase Eight',
            prospect: 'Laura',
            date: '2026-02-01',
            duration: '7:45',
            outcome: 'email',
            overall: 6.0,
            insight: 'Good reading of the situation but no concrete next step',
            scores: { gatekeeper: 'N/A', opener: 6, personalisation: 5, discovery: 7, callControl: 6, toneEnergy: 6, valueProp: 5, objections: 5, close: 5 },
            keyMoment: "Laura mentioned they're reviewing all vendors in Q2",
            improvement: "Should have asked 'when in Q2 are you making decisions? Let's book a call for [specific date]'"
          },
          {
            id: 'j5',
            company: 'Whistles',
            prospect: 'Ben',
            date: '2026-01-31',
            duration: '5:30',
            outcome: 'demo',
            overall: 7.0,
            insight: 'Solid all-round call',
            scores: { gatekeeper: 7, opener: 7, personalisation: 7, discovery: 7, callControl: 7, toneEnergy: 7, valueProp: 7, objections: 'N/A', close: 7 },
            keyMoment: "Good use of Charles Clinkard case study in context",
            improvement: "Practice connecting case study results to their specific situation"
          },
          {
            id: 'j6',
            company: 'Karen Millen',
            prospect: 'Sophie',
            date: '2026-01-30',
            duration: '8:00',
            outcome: 'not_interested',
            overall: 5.5,
            insight: 'Sophie had already evaluated Salesfire before - need to research accounts',
            scores: { gatekeeper: 'N/A', opener: 6, personalisation: 4, discovery: 5, callControl: 5, toneEnergy: 6, valueProp: 5, objections: 5, close: 5 },
            keyMoment: "Sophie revealed they looked at Salesfire 6 months ago",
            improvement: "Research call history before calling - could have addressed what changed since then"
          }
        ],
        radarScores: { gatekeeper: 7.3, opener: 6.8, personalisation: 6.2, discovery: 7.0, callControl: 6.5, toneEnergy: 6.8, valueProp: 6.2, objections: 6.0, close: 6.3 },
        progressData: [
          { week: 2, overall: 5.6, focusArea: 5.5, close: 5.2 },
          { week: 3, overall: 5.9, focusArea: 5.9, close: 5.5 },
          { week: 4, overall: 6.1, focusArea: 6.3, close: 5.8 },
          { week: 5, overall: 6.9, focusArea: 7.0, close: 6.3 }
        ],
        weekFocus: {
          title: "Connecting features to their specific outcomes",
          triggers: ["That's interesting", "How does that work?", "Tell me more"],
          dont: "Keep explaining features - they already understand",
          do: "Flip it: 'What would that mean for [their specific situation]?'",
          example: {
            context: "After explaining cross-device tracking to Dan, he said 'interesting' but Jack kept explaining instead of asking.",
            couldHaveSaid: "So for Quiz's customer base - lots of mobile browsing - what would capturing those cross-device visitors mean for your monthly numbers?"
          }
        }
      }
    },
    steph: {
      dailyStats: { totalDials: 42, connectedCalls: 6, connectionRate: 14.3 },
      focusToday: {
        instruction: "Before explaining Salesfire, ask one more discovery question. Resist the urge to pitch too early."
      },
      yesterdaysCalls: [
        {
          id: 'st1',
          company: 'Missguided',
          prospect: 'Kelly',
          date: '2026-02-02',
          duration: '5:40',
          outcome: 'demo',
          overall: 6.8,
          insight: 'Strong opener and good energy - could slow down during discovery'
        },
        {
          id: 'st2',
          company: 'Roman Originals',
          prospect: 'Michelle',
          date: '2026-02-02',
          duration: '6:25',
          outcome: 'email',
          overall: 5.5,
          insight: 'Michelle was interested but Steph moved to close before building enough value'
        },
        {
          id: 'st3',
          company: 'Joules',
          prospect: 'Pete',
          date: '2026-02-02',
          duration: '7:15',
          outcome: 'demo',
          overall: 7.4,
          insight: 'Great objection handling when Pete mentioned they built something in-house'
        }
      ],
      weeklyData: {
        weekNumber: 5,
        callsReviewed: 5,
        demosBooked: 2,
        demoChange: 0,
        avgOverall: 6.3,
        overallChange: 0.5,
        avgFocusArea: 5.8,
        focusAreaChange: 0.4,
        focusAreaName: 'Opener',
        calls: [
          {
            id: 'st1',
            company: 'Missguided',
            prospect: 'Kelly',
            date: '2026-02-02',
            duration: '5:40',
            outcome: 'demo',
            overall: 6.8,
            insight: 'Energy was great, discovery could be deeper',
            scores: { gatekeeper: 'N/A', opener: 7, personalisation: 6, discovery: 6, callControl: 6, toneEnergy: 7, valueProp: 7, objections: 'N/A', close: 7 },
            metrics: {
              talkTime: 60,
              talkSpeed: 152,
              monologue: 40,
              customerStory: 28,
              patience: 0.3,
            },
            areaBreakdown: {
              opener: {
                score: 7,
                why: 'The milk carton hook grabbed Kelly\'s attention immediately - she was curious within seconds.',
                well: 'Creative opener that stood out from the typical sales intro. Kelly even laughed which broke the ice.',
                improve: 'The hook is strong but you need to bridge it to Missguided\'s specific situation faster.',
                tryNext: 'After the hook lands, go straight to them: "For a brand like Missguided with the traffic you\'re pulling, that missing person problem is probably costing you six figures in email flow revenue."',
              },
              personalisation: {
                score: 6,
                why: 'Referenced Missguided as a brand but didn\'t dig into their specific challenges or recent changes.',
                well: 'Knew they were a fast fashion ecommerce brand which gave you a starting point.',
                improve: 'Missguided has been through major changes recently - showing you know their story would build instant trust.',
                tryNext: 'Research their recent news before calling. Even a simple "I know you\'ve been through some changes - how\'s the ecommerce side looking now?" shows you care.',
              },
              discovery: {
                score: 6,
                why: 'Only asked two questions before moving to the pitch. Kelly had more to share.',
                well: 'The questions you did ask were good - Kelly was opening up about their email performance.',
                improve: 'Your talk time was 60% which means you were doing most of the talking. Kelly barely got started.',
                tryNext: 'Force yourself to ask at least 4 discovery questions before any feature talk. Try: "What\'s your biggest frustration with your current email setup?" then "Tell me more about that."',
              },
              callControl: {
                score: 6,
                why: 'You were driving but too fast - Kelly needed more time to build conviction.',
                well: 'The call had momentum and moved forward - Kelly didn\'t lose interest.',
                improve: 'Moving to pitch too quickly meant Kelly agreed to a demo out of curiosity, not conviction. That\'s a weaker commitment.',
                tryNext: 'Slow the middle section down. Spend 3 minutes on discovery, not 1. The demo will hold better if Kelly truly understands the problem.',
              },
              toneEnergy: {
                score: 7,
                why: 'Great energy from start to finish - Kelly responded well to your enthusiasm.',
                well: 'You sound confident and excited about what Salesfire does. That\'s infectious.',
                improve: 'Your talk speed was 152 wpm which is slightly fast. When you slow down, you sound more authoritative.',
                tryNext: 'Try consciously slowing down during the value prop section. Fast = excited. Slow = expert. You want both.',
              },
              valueProp: {
                score: 7,
                why: 'Good explanation of cross-device tracking and how it connects to Missguided\'s email revenue.',
                well: 'Connected Salesfire\'s value to their Klaviyo setup - Kelly immediately understood the gap.',
                improve: 'The value prop came before Kelly had fully articulated the problem, so it felt like you were telling not solving.',
                tryNext: 'Let Kelly describe the problem first, then reflect it back: "So you\'re losing those mobile browsers when they switch devices - that\'s exactly the gap we close."',
              },
              close: {
                score: 7,
                why: 'Got the demo booked which is the goal. Kelly seemed genuinely interested.',
                well: 'Confident close with a specific time - didn\'t hesitate to ask.',
                improve: 'Could have confirmed who else should be on the call to increase show-up likelihood.',
                tryNext: 'After booking, always ask: "Who else handles your email/ecommerce side? It\'d be good to have them there so we only need to do this once."',
              },
            },
            keyMoment: "Good use of milk carton hook - Kelly was immediately curious",
            improvement: "Asked two discovery questions then moved to pitch - should have asked 3-4 more"
          },
          {
            id: 'st2',
            company: 'Roman Originals',
            prospect: 'Michelle',
            date: '2026-02-02',
            duration: '6:25',
            outcome: 'email',
            overall: 5.5,
            insight: 'Rushed to close before value was established',
            scores: { gatekeeper: 'N/A', opener: 6, personalisation: 5, discovery: 5, callControl: 5, toneEnergy: 6, valueProp: 5, objections: 5, close: 5 },
            metrics: {
              talkTime: 66,
              talkSpeed: 158,
              monologue: 48,
              customerStory: 18,
              patience: -0.5,
            },
            areaBreakdown: {
              opener: {
                score: 6,
                why: 'Got through the introduction but didn\'t give Michelle a compelling reason to keep listening.',
                well: 'Sounded friendly and professional - Michelle didn\'t hang up.',
                improve: 'Roman Originals\' customer base is older women who browse on tablets and desktops - that\'s a perfect Salesfire angle you missed.',
                tryNext: 'Lead with their audience: "Your customers tend to browse across multiple devices before buying - and most email platforms can\'t track that journey. Are you seeing that gap?"',
              },
              personalisation: {
                score: 5,
                why: 'Nothing specific to Roman Originals - could have been any ecommerce brand.',
                well: 'At least mentioned their email marketing which showed some awareness.',
                improve: 'Roman Originals has a very specific customer demographic. Showing you understand their audience builds instant credibility.',
                tryNext: 'Spend 5 minutes on their site before calling. Note their product range, their customer age group, their ESP. Mention one specific thing.',
              },
              discovery: {
                score: 5,
                why: 'Michelle handed you a golden nugget - she said they\'re not happy with email performance - and you moved straight to pitching.',
                well: 'You picked up on the email frustration which was the right thread.',
                improve: 'When someone tells you their problem, your job is to make it bigger, not solve it immediately. Dig deeper first.',
                tryNext: 'When Michelle says "email isn\'t performing" - respond with: "What specifically isn\'t working? Is it opens, clicks, or the revenue per send?" Let her diagnose it.',
              },
              callControl: {
                score: 5,
                why: 'You were talking for 66% of the call. Michelle barely got a word in.',
                well: 'The call moved forward and didn\'t stall.',
                improve: 'Control doesn\'t mean talking more. The best-controlled calls have the prospect talking 55-60% of the time.',
                tryNext: 'Set a mental rule: after every statement you make, ask a question. Statement, question, statement, question.',
              },
              toneEnergy: {
                score: 6,
                why: 'Good energy but it was one-note - didn\'t adjust to Michelle\'s more measured pace.',
                well: 'Stayed positive and upbeat throughout which kept the conversation from going flat.',
                improve: 'Michelle was speaking slower and more carefully than you. That mismatch can feel overwhelming.',
                tryNext: 'Mirror their pace. If Michelle speaks at 120 wpm, slow to 130 max. Speed matching builds subconscious rapport.',
              },
              valueProp: {
                score: 5,
                why: 'Explained Salesfire features but didn\'t connect them to Roman Originals\' email performance issue.',
                well: 'Covered the key points about cross-device tracking and cookie limitations.',
                improve: 'Michelle told you the problem - your value prop should have been a direct answer to it.',
                tryNext: 'Use her words: "You said email isn\'t performing how you\'d like. Most of the time, the issue isn\'t the emails - it\'s that you can\'t see 60% of the people who should be getting them."',
              },
              objections: {
                score: 5,
                why: 'Michelle didn\'t explicitly object but her lack of engagement was an objection in itself.',
                well: 'Didn\'t push too hard when Michelle wasn\'t engaging.',
                improve: 'Silence or short answers are soft objections. You need to address the unspoken concern.',
                tryNext: 'When someone goes quiet, check in: "Michelle, I want to make sure this is relevant - does this connect to the email challenges you mentioned?"',
              },
              close: {
                score: 5,
                why: 'Settled for an email send when Michelle had shown enough interest for at least a short follow-up call.',
                well: 'Secured the email follow-up rather than ending with nothing.',
                improve: 'Michelle mentioned unhappiness with email performance - that\'s enough pain to justify a 25-minute call.',
                tryNext: 'Try: "Look, you mentioned email isn\'t where you want it. Can I show you in 25 minutes exactly where those visitors are going? If it doesn\'t click, no worries."',
              },
            },
            keyMoment: "Michelle mentioned they're not happy with current email performance",
            improvement: "When Michelle mentioned email issues, should have dug deeper: 'What specifically isn't working?'"
          },
          {
            id: 'st3',
            company: 'Joules',
            prospect: 'Pete',
            date: '2026-02-01',
            duration: '7:15',
            outcome: 'demo',
            overall: 7.4,
            insight: 'Perfect handling of internal tool objection',
            scores: { gatekeeper: 8, opener: 7, personalisation: 7, discovery: 7, callControl: 7, toneEnergy: 7, valueProp: 7, objections: 8, close: 7 },
            metrics: {
              talkTime: 44,
              talkSpeed: 134,
              monologue: 26,
              customerStory: 62,
              patience: 2.6,
            },
            keyMoment: "When Pete said 'we built something', Steph asked 'what does it track? Cross-device? Outside the cookie window?' - Pete realized gaps",
            improvement: "Great call - this is the pattern to repeat"
          },
          {
            id: 'st4',
            company: 'White Stuff',
            prospect: 'Hannah',
            date: '2026-01-31',
            duration: '5:50',
            outcome: 'warm_lead',
            overall: 6.2,
            insight: 'Good rapport but lost momentum mid-call',
            scores: { gatekeeper: 7, opener: 7, personalisation: 6, discovery: 6, callControl: 5, toneEnergy: 6, valueProp: 6, objections: 'N/A', close: 5 },
            keyMoment: "Hannah engaged well with the cross-device story",
            improvement: "Mid-call went quiet - should have asked more questions to keep Hannah talking"
          },
          {
            id: 'st5',
            company: 'FatFace',
            prospect: 'Andrew',
            date: '2026-01-30',
            duration: '4:55',
            outcome: 'not_interested',
            overall: 5.2,
            insight: 'Andrew was dismissive from the start - gatekeeper skills needed',
            scores: { gatekeeper: 5, opener: 5, personalisation: 4, discovery: 5, callControl: 4, toneEnergy: 4, valueProp: 5, objections: 5, close: 5 },
            keyMoment: "Andrew asked 'who are you?' in dismissive tone - Steph got flustered",
            improvement: "Practice confident response to dismissive gatekeepers: 'It's Steph from Salesfire - I work with [competitor] and wanted to share something quick'"
          }
        ],
        radarScores: { gatekeeper: 6.7, opener: 6.4, personalisation: 5.6, discovery: 5.8, callControl: 5.4, toneEnergy: 6.0, valueProp: 6.0, objections: 6.0, close: 5.8 },
        progressData: [
          { week: 2, overall: 5.4, focusArea: 5.2, close: 5.0 },
          { week: 3, overall: 5.6, focusArea: 5.5, close: 5.2 },
          { week: 4, overall: 5.8, focusArea: 5.6, close: 5.5 },
          { week: 5, overall: 6.3, focusArea: 5.8, close: 5.8 }
        ],
        weekFocus: {
          title: "Deepening discovery before pitching",
          triggers: ["After 2 questions", "When you feel the urge to explain", "When they seem interested"],
          dont: "Move to pitch when you feel momentum",
          do: "Ask 'Tell me more about that' or 'What does that look like day-to-day?'",
          example: {
            context: "With Michelle, Steph asked about their ESP then immediately launched into how Salesfire helps. Michelle hadn't shared enough context.",
            couldHaveSaid: "You mentioned email isn't performing - tell me more about that. What are you seeing vs what you expected?"
          }
        }
      }
    }
  };

  const variant = dataVariants[slug] || dataVariants.katie;

  const weeklyCalls = variant.weeklyData!.calls;
  const last30DaysCalls = weeklyCalls;
  const demosBooked = last30DaysCalls.filter(c => c.outcome === 'demo').length;
  const avgOverall = last30DaysCalls.length > 0
    ? Math.round((last30DaysCalls.reduce((sum, c) => sum + c.overall, 0) / last30DaysCalls.length) * 10) / 10
    : 0;

  return {
    sdrName: sdr.name,
    sdrSlug: sdr.slug,
    date,
    currentView: 'daily',
    teamAvgConnectionRate: 12.7,
    dailyStats: variant.dailyStats!,
    focusToday: variant.focusToday!,
    yesterdaysCalls: variant.yesterdaysCalls!,
    weeklyData: variant.weeklyData!,
    last30DaysData: {
      callsReviewed: last30DaysCalls.length,
      demosBooked,
      avgOverall,
      calls: last30DaysCalls,
    },
    libraryData: {
      callsReviewed: 0,
      demosBooked: 0,
      avgOverall: 0,
      calls: [],
    },
    allTimeRadarScores: allTimeRadarVariants[slug] || allTimeRadarVariants.katie,
    playbook
  };
};
