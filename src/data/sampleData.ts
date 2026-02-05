import { DashboardData, SDRInfo, Playbook } from '@/types';

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
    playbook
  };
};
