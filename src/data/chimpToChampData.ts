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
  followUp?: {
    title: string;
    question: string;
  } | string; // Support both new format and legacy string format
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

// ─── Live Script types ────────────────────────────────────────────────────────

export interface LiveScriptLine {
  speaker: 'sdr' | 'prospect';
  text: string;
  note?: string;
  emphasis?: boolean;
}

export interface ToolboxQuestion {
  id: string;
  text: string;
  title?: string; // Optional title for scannable follow-ups
}

export interface BranchPhaseContent {
  id: string;
  title: string;
  instruction?: string;
  type: 'dialogue' | 'toolbox' | 'narrative';
  lines?: LiveScriptLine[];
  questions?: ToolboxQuestion[];
}

export interface BranchClose {
  lines: LiveScriptLine[];
}

export interface FrustrationBranch {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
  openerScript: string;
  phases: BranchPhaseContent[];
  loopBack: string;
  close: BranchClose;
}

export interface NoneResonateBranch {
  id: 'none-resonate';
  label: string;
  subtitle: string;
  ratingPrompt: string;
  followUpHigh: string;
  followUpLow: string;
  phases: BranchPhaseContent[];
  close: BranchClose;
}

export interface LiveScriptOpener {
  lines: LiveScriptLine[];
  transitionPrompt: string;
}

export interface LiveScriptSection {
  type: 'live-script';
  id: string;
  tabLabel: string;
  opener: LiveScriptOpener;
  frustrations: FrustrationBranch[];
  noneResonate: NoneResonateBranch;
}

export type PlaybookSection =
  | HeroSection
  | QuestionsSection
  | TextSection
  | CallFlowSection
  | ListSection
  | ScriptSection
  | LiveScriptSection;

// ─── Utility functions for follow-up handling ────────────────────────────────

/**
 * Gets the follow-up title, either from the new format or generates one from legacy text
 */
export function getFollowUpTitle(followUp: Question['followUp']): string | undefined {
  if (!followUp) return undefined;
  if (typeof followUp === 'string') {
    // Auto-generate title from text for legacy format
    return generateTitleFromText(followUp);
  }
  return followUp?.title;
}

/**
 * Gets the follow-up question text
 */
export function getFollowUpQuestion(followUp: Question['followUp']): string | undefined {
  if (!followUp) return undefined;
  if (typeof followUp === 'string') {
    return followUp;
  }
  return followUp?.question;
}

/**
 * Gets the toolbox question title
 */
export function getToolboxQuestionTitle(question: ToolboxQuestion): string | undefined {
  if (question.title) {
    return question.title;
  }
  // Auto-generate title for questions without explicit titles
  return generateTitleFromText(question.text);
}

/**
 * Gets the toolbox question text
 */
export function getToolboxQuestionText(question: ToolboxQuestion): string {
  return question.text;
}

/**
 * Generates a concise title from follow-up question text
 */
function generateTitleFromText(text: string): string {
  // Simple title generation logic - take first few key words
  const words = text.toLowerCase()
    .replace(/['"?]/g, '') // Remove quotes and question marks
    .split(' ')
    .filter(word => !['what', 'why', 'how', 'when', 'where', 'who', 'that', 'made', 'you', 'it', 'the', 'a', 'an', 'is', 'are', 'was', 'were'].includes(word));

  const titleWords = words.slice(0, 2);
  return titleWords.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

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

  tabOrder: ['value-prop', 'live-script'],

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

    // ── Live Script tab ────────────────────────────────────────────────────
    {
      type: 'live-script' as const,
      id: 'live-script',
      tabLabel: 'Live Script',
      opener: {
        lines: [
          { speaker: 'sdr' as const, text: 'Hi [Name], it\'s [Your name] from Salesfire. Hope you\'re having a good day.' },
          { speaker: 'sdr' as const, text: 'I\'ve been having some really interesting conversations with retailers who are on Mailchimp, and basically the same frustrations keep coming up. Can I just check — you\'re still using Mailchimp, aren\'t you?' },
          { speaker: 'prospect' as const, text: '[Yes]' },
          { speaker: 'sdr' as const, text: 'Brilliant. Look, you don\'t have a couple of minutes, do you? Honestly, it\'s like they\'re all reading from the same script.' },
          { speaker: 'prospect' as const, text: '[Yes]' },
          { speaker: 'sdr' as const, text: 'So basically, four things keep coming up, and I\'m just curious if any of these sound familiar to you:' },
        ],
        transitionPrompt: 'Do any of those sound familiar?',
      },
      frustrations: [
        // ── Automation Ceiling ───────────────────────────────────────────
        {
          id: 'automation-ceiling',
          label: 'Automation Ceiling',
          subtitle: 'Wanting to do more but hitting limits',
          icon: '⚙️',
          openerScript: 'First thing — quite a few are saying they\'re hitting a bit of a ceiling with automation. You know, there\'s stuff they want to build but they just can\'t seem to get it to work the way they want.',
          phases: [
            {
              id: 'ac-discovery',
              title: 'Discovery',
              type: 'dialogue' as const,
              lines: [
                { speaker: 'sdr' as const, text: 'Right, so the automation side of things. What\'s it looking like at the moment — what flows have you got running?' },
              ],
            },
            {
              id: 'ac-followups',
              title: 'Follow-ups',
              instruction: 'Use as needed — these are a toolbox, not a checklist. Pick what fits the conversation.',
              type: 'toolbox' as const,
              questions: [
                { id: 'ac-q1', title: 'Advanced Flows', text: 'Have you tried setting up anything beyond the basics — like post-purchase or win-back flows? How did that go?' },
                { id: 'ac-q2', title: 'Platform Limits', text: 'Are there things you\'ve wanted to automate but just couldn\'t get Mailchimp to do?' },
                { id: 'ac-q3', title: 'Manual Work', text: 'How much time does your team spend manually doing things that should be automated?' },
                { id: 'ac-q4', title: 'Personalisation Level', text: 'Do you feel like your flows are actually personalised, or are they pretty much the same for everyone?' },
                { id: 'ac-q5', title: 'Dream Flow', text: 'If you could build any flow tomorrow with no limitations, what would it be?' },
              ],
            },
            {
              id: 'ac-normalize',
              title: 'Normalise & Quantify',
              type: 'dialogue' as const,
              lines: [
                { speaker: 'sdr' as const, text: 'Yeah, we hear that a lot. Mailchimp is great for getting started, but once you want to do anything more sophisticated — conditional splits, proper behavioural triggers, that kind of thing — you hit a wall pretty quickly.' },
                { speaker: 'sdr' as const, text: 'The brands we work with, when they move to a platform that actually lets them build those flows, typically see a significant jump in email revenue — because the right message is going to the right person at the right time, instead of the same blast going to everyone.' },
                { speaker: 'sdr' as const, text: 'What do you think that ceiling is costing you right now? Even roughly.' },
              ],
            },
          ],
          loopBack: 'Now, the other frustrations I mentioned — the browse abandonment, the support, the personalisation — are any of those resonating as well?',
          close: {
            lines: [
              { speaker: 'sdr' as const, text: 'Here\'s what I\'d suggest. Let me get you booked in with [BDM name] — they specialise in helping brands break through that automation ceiling.' },
              { speaker: 'sdr' as const, text: 'They\'ll show you exactly what\'s possible — the flows, the conditional logic, the behavioural triggers — and how it\'d work for your store specifically.' },
              { speaker: 'sdr' as const, text: 'And if you like the look of it, we do a free proof of concept — live on your site in under 3 minutes. No commitment.' },
              { speaker: 'sdr' as const, text: 'How does [day] at [time] look for a 25-minute call?' },
              { speaker: 'prospect' as const, text: '[Agrees / suggests alternative]' },
              { speaker: 'sdr' as const, text: 'Perfect. I\'ll get that sent over now. Is [email] the best one?' },
            ],
          },
        },
        // ── Personalisation ──────────────────────────────────────────────
        {
          id: 'personalisation',
          label: 'Personalisation',
          subtitle: 'Right message, right person, right time',
          icon: '🎯',
          openerScript: 'Second — they\'re struggling to actually personalise the content in their emails so they resonate more with customers. It all feels a bit generic.',
          phases: [
            {
              id: 'ps-discovery',
              title: 'Discovery',
              type: 'dialogue' as const,
              lines: [
                { speaker: 'sdr' as const, text: 'Right, so the personalisation side of things. What\'s it looking like at the moment — how targeted are your emails right now?' },
              ],
            },
            {
              id: 'ps-followups',
              title: 'Follow-ups',
              instruction: 'Use as needed — these are a toolbox, not a checklist. Pick what fits the conversation.',
              type: 'toolbox' as const,
              questions: [
                { id: 'ps-q1', title: 'Segmentation', text: 'Are you able to segment based on actual purchase behaviour, or is it mostly list tags and manual segments?' },
                { id: 'ps-q2', title: 'Dynamic Content', text: 'Do your emails change based on what someone\'s been looking at on your site, or is it the same content for everyone?' },
                { id: 'ps-q3', title: 'Content Blocks', text: 'Have you tried dynamic content blocks — showing different products to different people in the same email?' },
                { id: 'ps-q4', title: 'Send Timing', text: 'How confident are you that your emails are landing at the right time for each person?' },
                { id: 'ps-q5', text: 'If you could wave a magic wand and have fully personalised emails tomorrow, what would that look like for you?' },
              ],
            },
            {
              id: 'ps-normalize',
              title: 'Normalise & Quantify',
              type: 'dialogue' as const,
              lines: [
                { speaker: 'sdr' as const, text: 'Yeah, that\'s really common with Mailchimp. The segmentation is pretty surface-level — you can tag people, but you can\'t build segments based on what they actually do on your site.' },
                { speaker: 'sdr' as const, text: 'The brands we work with move to a platform where segments are built on real purchase data, browsing behaviour, and predictive analytics. So every email feels relevant — not just another blast.' },
                { speaker: 'sdr' as const, text: 'What do you think sending more targeted, personalised emails would do for your open rates and revenue?' },
              ],
            },
          ],
          loopBack: 'Now, the other frustrations I mentioned — the browse abandonment, the automation ceiling, the support — are any of those resonating as well?',
          close: {
            lines: [
              { speaker: 'sdr' as const, text: 'Here\'s what I\'d suggest. Let me get you booked in with [BDM name] — they specialise in showing brands what real personalisation looks like.' },
              { speaker: 'sdr' as const, text: 'They\'ll show you the dynamic content, the predictive send times, the behavioural segments — and how it\'d work for your store.' },
              { speaker: 'sdr' as const, text: 'And if you like the look of it, we do a free proof of concept — live on your site in under 3 minutes. No commitment.' },
              { speaker: 'sdr' as const, text: 'How does [day] at [time] look for a 25-minute call?' },
              { speaker: 'prospect' as const, text: '[Agrees / suggests alternative]' },
              { speaker: 'sdr' as const, text: 'Perfect. I\'ll get that sent over now. Is [email] the best one?' },
            ],
          },
        },
        // ── Browse/Cart Abandonment ──────────────────────────────────────
        {
          id: 'browse-cart',
          label: 'Browse/Cart Abandonment',
          subtitle: 'Cookie expiry & revenue leakage',
          icon: '🛒',
          openerScript: 'Third one — and this is interesting — they\'re noticing their browse and cart abandonment emails aren\'t sending to as many people as they think they should. Like there\'s people slipping through the cracks.',
          phases: [
            {
              id: 'bc-discovery',
              title: 'Discovery / Normalisation',
              instruction: 'Walk them through the cookie problem step by step. This is a narrative — keep it conversational.',
              type: 'narrative' as const,
              lines: [
                { speaker: 'sdr' as const, text: 'Right, so the browse and cart abandonment side of things. Let me explain something that\'s probably happening right now and you might not even know about it.' },
                { speaker: 'sdr' as const, text: 'So when someone visits your site, Mailchimp drops a cookie to track them — that\'s how it knows to trigger a browse abandonment or cart abandonment flow. Makes sense, right?' },
                { speaker: 'prospect' as const, text: '[Yeah / Sure]' },
                { speaker: 'sdr' as const, text: 'The problem is, that cookie expires really quickly. And once it expires, the next time that same person comes back to your site, Mailchimp sees them as a brand new visitor. It has no idea they were there before.' },
                { speaker: 'sdr' as const, text: 'So your browse abandonment flow, your cart abandonment flow — they just don\'t fire. That person browses, maybe adds something to their cart, leaves… and nothing happens. No email. No follow-up. They\'re gone.' },
                { speaker: 'prospect' as const, text: '[Reacts — surprise, frustration, or asks how big the problem is]' },
                { speaker: 'sdr' as const, text: 'And it\'s not a small number of people either. I\'ll get to the numbers in a sec, but first — have you noticed anything like that? Like your abandonment flows not firing as much as you\'d expect?', note: 'Pause here. Let them talk.' },
              ],
            },
            {
              id: 'bc-quantify',
              title: 'Quantifying the Cost',
              instruction: 'Make it real with numbers. Use their own revenue if you have it, or the 40-50% stat.',
              type: 'narrative' as const,
              lines: [
                { speaker: 'sdr' as const, text: 'So the brands we work with — when they move off Mailchimp and onto a platform that actually tracks properly — they typically see a 40 to 50% uplift in revenue from those abandonment flows alone.' },
                { speaker: 'sdr' as const, text: 'Just to put that in perspective — if your cart abandonment flow is generating, say, £5,000 a month right now, that means you could be leaving another £2,000 to £2,500 on the table every single month. Just from the cookie problem.' },
                { speaker: 'prospect' as const, text: '[Reacts]' },
                { speaker: 'sdr' as const, text: 'And that\'s before we even talk about browse abandonment — which most Mailchimp setups either don\'t have running properly or aren\'t triggering for the same reason.' },
                { speaker: 'sdr' as const, text: 'What does your cart abandonment flow bring in at the moment? Even a rough idea.', note: 'Get their number. Use it to calculate the uplift live.' },
              ],
            },
          ],
          loopBack: 'Now, the other frustrations I mentioned — the automation ceiling, the support, the personalisation — are any of those resonating as well?',
          close: {
            lines: [
              { speaker: 'sdr' as const, text: 'Look, here\'s what I\'d suggest. I\'ll get you booked in with [BDM name] — they\'re one of our e-commerce specialists.' },
              { speaker: 'sdr' as const, text: 'They\'ll walk you through exactly how the tracking works differently, show you the abandonment flows in action, and give you a real number on what you\'re leaving on the table.' },
              { speaker: 'sdr' as const, text: 'And if you like the look of it, we do a free proof of concept — live on your site in under 3 minutes. No commitment, no contract, just data.' },
              { speaker: 'sdr' as const, text: 'How does [day] at [time] look for a 25-minute call?' },
              { speaker: 'prospect' as const, text: '[Agrees / suggests alternative]' },
              { speaker: 'sdr' as const, text: 'Perfect. I\'ll get that sent over now. Is [email] the best one to send the invite to?' },
            ],
          },
        },
        // ── Support Black Hole ───────────────────────────────────────────
        {
          id: 'support-blackhole',
          label: 'Support Black Hole',
          subtitle: 'Can\'t get real help when you need it',
          icon: '🕳️',
          openerScript: 'And the fourth thing is just a distinct lack of actual support when things go wrong.',
          phases: [
            {
              id: 'sb-discovery',
              title: 'Discovery',
              type: 'dialogue' as const,
              lines: [
                { speaker: 'sdr' as const, text: 'Right, so the support side of things. What\'s your experience been like when you actually need help from Mailchimp?' },
              ],
            },
            {
              id: 'sb-followups',
              title: 'Follow-ups',
              instruction: 'Use as needed — these are a toolbox, not a checklist. Pick what fits the conversation.',
              type: 'toolbox' as const,
              questions: [
                { id: 'sb-q1', title: 'Emergency Response', text: 'When something breaks — a flow stops working, deliverability drops — how quickly can you get someone on the phone?' },
                { id: 'sb-q2', title: 'Chatbot Frustration', text: 'Have you ever been stuck waiting on a chatbot when you needed a real answer?' },
                { id: 'sb-q3', title: 'Account Knowledge', text: 'Do you feel like you\'ve got a dedicated person who actually knows your account, or is it a different person every time?' },
                { id: 'sb-q4', text: 'How much time have you lost trying to troubleshoot things yourself because support couldn\'t help fast enough?' },
                { id: 'sb-q5', title: 'Proactive Support', text: 'If you had someone who proactively flagged issues and suggested improvements — not just fixed tickets — how would that change things?' },
              ],
            },
            {
              id: 'sb-normalize',
              title: 'Normalise & Quantify',
              type: 'dialogue' as const,
              lines: [
                { speaker: 'sdr' as const, text: 'Yeah, that\'s one of the biggest things we hear. Mailchimp\'s support model just doesn\'t scale — once you\'re past a certain size, you need someone who actually picks up the phone and knows your account.' },
                { speaker: 'sdr' as const, text: 'The brands we work with get a dedicated onboarding team, a managed migration — we handle the whole thing — and ongoing support from real people. No chatbot runaround.' },
                { speaker: 'sdr' as const, text: 'How much time would you say your team spends on things that better support would just handle for you?' },
              ],
            },
          ],
          loopBack: 'Now, the other frustrations I mentioned — the browse abandonment, the automation ceiling, the personalisation — are any of those resonating as well?',
          close: {
            lines: [
              { speaker: 'sdr' as const, text: 'Here\'s what I\'d suggest. Let me get you booked in with [BDM name] — they\'ll walk you through exactly what the support model looks like.' },
              { speaker: 'sdr' as const, text: 'Dedicated team, managed migration, the whole thing. They\'ll show you how it works and answer any questions about the transition.' },
              { speaker: 'sdr' as const, text: 'And if you like the look of it, we do a free proof of concept — live on your site in under 3 minutes. No commitment.' },
              { speaker: 'sdr' as const, text: 'How does [day] at [time] look for a 25-minute call?' },
              { speaker: 'prospect' as const, text: '[Agrees / suggests alternative]' },
              { speaker: 'sdr' as const, text: 'Perfect. I\'ll get that sent over now. Is [email] the best one?' },
            ],
          },
        },
      ],
      noneResonate: {
        id: 'none-resonate',
        label: 'None Resonate',
        subtitle: 'Prospect doesn\'t identify with any frustration',
        ratingPrompt: 'Can you rate Mailchimp out of 10 for me?',
        followUpHigh: 'Interesting — so what would make it a 10?',
        followUpLow: 'Right — so what would make it higher?',
        phases: [
          {
            id: 'nr-discovery',
            title: 'Discovery',
            instruction: '⚠️ PLACEHOLDER — Use rating to uncover hidden pain points.',
            type: 'dialogue' as const,
            lines: [
              { speaker: 'sdr' as const, text: 'That\'s fair enough. Let me ask you this — if you had to rate Mailchimp out of 10, where would you put it?' },
              { speaker: 'prospect' as const, text: '[Gives a number]' },
              { speaker: 'sdr' as const, text: '[If 8+] Interesting — so what would make it a 10?', note: '⚠️ Placeholder — adapt based on rating' },
              { speaker: 'sdr' as const, text: '[If <8] Right — so what would make it higher?', note: '⚠️ Placeholder — adapt based on rating' },
              { speaker: 'prospect' as const, text: '[Shares gaps / wishes]' },
              { speaker: 'sdr' as const, text: 'That\'s interesting. Tell me more about that — what does that actually look like day to day?', note: '⚠️ Placeholder — dig deeper into whatever they surface' },
            ],
          },
        ],
        close: {
          lines: [
            { speaker: 'sdr' as const, text: '⚠️ PLACEHOLDER — Based on what you\'ve shared, I think it\'d be worth having a quick chat with [BDM name].' },
            { speaker: 'sdr' as const, text: 'They can show you what\'s possible and give you a real comparison. 25 minutes, no commitment.' },
            { speaker: 'sdr' as const, text: 'How does [day] at [time] look?' },
            { speaker: 'prospect' as const, text: '[Agrees / suggests alternative]' },
            { speaker: 'sdr' as const, text: 'Perfect. I\'ll get that sent over now. Is [email] the best one?' },
          ],
        },
      },
    },

    /* ── Old tabs (kept for Klaviyo AI Connect — not routed in Chimp to Champ) ── */

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
          followUp: {
            title: 'Setup Origins',
            question: 'What made you set it up that way originally?'
          },
          whyItWorks:
            'Open-ended and non-threatening. Lets them self-diagnose — most will volunteer frustrations without you having to push.',
        },
        {
          number: 2,
          question: 'What does your current flow setup look like — welcome series, abandoned cart, that kind of thing?',
          followUp: {
            title: 'Performance Check',
            question: 'Are those performing the way you\'d like?'
          },
          whyItWorks:
            'Gets specific about their automation maturity. Mailchimp users often have basic flows or none at all — this exposes the gap.',
        },
        {
          number: 3,
          question: 'When you look at your email revenue vs your site traffic, do the numbers add up?',
          followUp: {
            title: 'Gap Analysis',
            question: 'What do you think is causing that gap?'
          },
          whyItWorks:
            'Introduces the revenue gap concept. Forces them to confront the disconnect between traffic and email capture — which is where we win.',
        },
        {
          number: 4,
          question: 'Have you ever felt limited by what Mailchimp can do — segmentation, reporting, anything like that?',
          followUp: {
            title: 'Specific Limitations',
            question: 'Tell me more about that...'
          },
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
          description: 'Specific ask: "Would Thursday at 2pm work for a 25-minute demo?" Lock in the day and time.',
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
                  line: 'I think a 25-minute demo would show you more than another email. How does Thursday at 2pm look?',
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
                'Right, so that\u2019s brilliant that you\u2019re happy with Mailchimp \u2014 what we\u2019re really talking about is taking everything you love about it and just making it smarter. Basically, you get all the same functionality but with proper behavioural data, so your emails actually know what people are looking at on your site.',
              followUp:
                'Does it make sense to spend 20 minutes to at least find out a little more?',
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
                  line: 'Look, the emails gave you the theory \u2014 a 25-minute demo gives you the proof. I can show you exactly what this would look like for [their store]. How does Thursday at 2pm work?',
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
                'If the \u20188 strangers\u2019 thing is happening, you\u2019re leaving revenue on the table every day. Worth 25 minutes to see the scale?',
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
                'Happy to. You\u2019ve already read the best stuff though. What would a new email tell you that a 25-minute call wouldn\u2019t?',
              followUp:
                'I\u2019d rather show you your own data than send you someone else\u2019s. How about a quick demo instead?',
            },
          ],
        },
      ],
    },
  ],
};
