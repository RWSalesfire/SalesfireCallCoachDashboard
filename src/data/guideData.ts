export interface ScoreBand {
  range: string;
  label: string;
  color: 'good' | 'focus' | 'alert';
  description: string;
}

export interface ScriptPhrase {
  context?: string;
  script: string;
}

export interface RealExample {
  type: 'good' | 'bad';
  text: string;
}

export interface ScoringArea {
  id: string;
  title: string;
  description: string;
  scoreBands: ScoreBand[];
  whatGoodLooksLike: string[];
  scriptsAndPhrases: ScriptPhrase[];
  commonMistakes: string[];
  realExamples: RealExample[];
}

export interface MetricThreshold {
  metric: string;
  green: string;
  amber: string;
  red: string;
}

export interface GoldenRule {
  number: number;
  title: string;
  description: string;
}

export interface GuideData {
  metrics: MetricThreshold[];
  scoringAreas: ScoringArea[];
  goldenRules: GoldenRule[];
}

export const guideData: GuideData = {
  metrics: [
    { metric: 'Talk Time', green: '40-50%', amber: '50-60%', red: '60%+' },
    { metric: 'Talk Speed', green: '125-145 wpm', amber: '145-160 wpm', red: '160+ wpm' },
    { metric: 'Monologue', green: 'Under 40s', amber: '40-60s', red: '60s+' },
    { metric: 'Customer Story', green: '45s+', amber: '15-44s', red: 'Under 15s' },
    { metric: 'Patience', green: '0 or positive', amber: '-1 to -10s', red: '-10s or worse' },
  ],

  scoringAreas: [
    {
      id: 'gatekeeper',
      title: 'Gatekeeper',
      description: 'Navigating past reception/admin to reach the decision-maker',
      scoreBands: [
        { range: '7+', label: 'Good', color: 'good', description: 'Got through confidently, gathered intel' },
        { range: '5-6', label: 'Focus', color: 'focus', description: 'Got through but no additional info' },
        { range: '<5', label: 'Alert', color: 'alert', description: 'Got blocked or pitched the wrong person' },
      ],
      whatGoodLooksLike: [
        'Confident, sounds like you belong',
        'Has a specific reason for calling',
        'Asks for intel while navigating',
      ],
      scriptsAndPhrases: [
        { script: 'Hi, I\'m looking for whoever handles your email marketing or Klaviyo - would that be [name] or someone else?' },
        { script: 'Before you put me through - is there anyone else involved in decisions around your email platform?' },
      ],
      commonMistakes: [
        'Pitching the gatekeeper ("We help companies increase revenue by...")',
        'Being vague ("I just wanted to have a chat about...")',
        'Accepting "send an email" without pushing back',
        'Not asking who else should be involved',
      ],
      realExamples: [
        { type: 'good', text: 'Built rapport with the gatekeeper, got the email forwarded to the decision-maker. Didn\'t try to bulldoze through - treated them as an ally.' },
        { type: 'bad', text: 'Spent 5 minutes pitching before discovering "I\'m not the person who makes that decision." Should have qualified in the first 30 seconds.' },
      ],
    },
    {
      id: 'opener',
      title: 'Opener',
      description: 'The first 30 seconds - getting permission and creating curiosity',
      scoreBands: [
        { range: '7+', label: 'Good', color: 'good', description: 'Permission granted + prospect engaged/curious' },
        { range: '5-6', label: 'Focus', color: 'focus', description: 'Permission granted but generic, no hook' },
        { range: '<5', label: 'Alert', color: 'alert', description: 'Rushed, no permission, or immediate resistance' },
      ],
      whatGoodLooksLike: [
        'Asks for time/permission',
        'Has a hook that creates curiosity',
        'Sounds different from every other cold caller',
      ],
      scriptsAndPhrases: [
        { script: 'Hi [Name], it\'s [Your name] from Salesfire. Have I caught you at an okay time for a quick call?' },
        { script: 'I was looking at your site and noticed something interesting with your email setup - do you have 2 minutes?' },
        { script: 'I\'ll be straight with you - this is a cold call, but I think I\'ve spotted something that could help. Can I take 60 seconds to explain why I\'m calling?' },
      ],
      commonMistakes: [
        'No permission ask - just launching in',
        '"Just checking in" or "Just following up" (says nothing)',
        'Reading from a script robotically',
        'Talking too fast (sounds nervous/salesy)',
      ],
      realExamples: [
        { type: 'good', text: 'Strong opener that created engagement quickly. Asked for time, professional delivery, referenced their international expansion to create immediate curiosity.' },
        { type: 'bad', text: 'Rushed the opening at 190+ wpm. Prospect was clearly busy and the speed made it worse. Sounded like every other cold caller.' },
      ],
    },
    {
      id: 'personalisation',
      title: 'Personalisation',
      description: 'Showing you\'ve done your homework on their specific business',
      scoreBands: [
        { range: '7+', label: 'Good', color: 'good', description: 'Referenced specific products, tech stack, recent activity' },
        { range: '5-6', label: 'Focus', color: 'focus', description: 'General sector awareness but nothing specific' },
        { range: '<5', label: 'Alert', color: 'alert', description: 'Generic pitch that could apply to anyone' },
      ],
      whatGoodLooksLike: [
        'Mentions something specific from their website',
        'References their tech stack (Klaviyo, Shopify, etc.)',
        'Shows awareness of their sector challenges',
      ],
      scriptsAndPhrases: [
        { script: 'I noticed you\'re running Klaviyo and you\'ve got your abandonment flows set up - but there\'s a gap most brands don\'t know about...' },
        { script: 'I was looking at your [product category] range - how\'s that performing for you at the moment?' },
        { script: 'I saw you recently [launched X / moved to Shopify / ran a campaign] - how did that go?' },
      ],
      commonMistakes: [
        'Zero research - just dialling numbers',
        'Only knowing company name and nothing else',
        'Generic sector talk ("retailers like you...")',
        'Not using intel gathered on previous calls',
      ],
      realExamples: [
        { type: 'good', text: 'Referenced their Shopify migration specifically. Showed understanding of their situation and what that move meant for their email setup.' },
        { type: 'bad', text: 'No specific details about their setup or challenges. Could have been calling literally anyone in retail.' },
      ],
    },
    {
      id: 'discovery',
      title: 'Discovery',
      description: 'Asking questions and LISTENING to understand their situation',
      scoreBands: [
        { range: '7+', label: 'Good', color: 'good', description: 'Customer story 45s+, open questions, active listening' },
        { range: '5-6', label: 'Focus', color: 'focus', description: 'Some questions but didn\'t dig deep enough' },
        { range: '<5', label: 'Alert', color: 'alert', description: 'Talked over prospect, no real discovery' },
      ],
      whatGoodLooksLike: [
        'Open questions that get them talking',
        'Silence after questions (let them think)',
        'Follow-up questions that go deeper',
        'Summarising what you heard',
      ],
      scriptsAndPhrases: [
        { script: 'Tell me about your current email setup - what\'s working and what\'s frustrating you?' },
        { script: 'What made you set it up that way?' },
        { script: 'Tell me more about that...' },
        { script: 'So if I\'m hearing you right, the main challenge is [X] - is that fair?' },
      ],
      commonMistakes: [
        'One question then 60s monologue',
        'Closed questions (yes/no answers)',
        'Interrupting when they\'re explaining',
        'Not following up on interesting points',
        'Jumping to solution before understanding the problem',
      ],
      realExamples: [
        { type: 'good', text: '71s customer story - prospect explained their DHL trials and international expansion in detail. Asked one good question and then shut up.' },
        { type: 'bad', text: '78% talk time. Identified their email system is broken but didn\'t dig deeper or let the prospect explain. Feature dump instead of discovery.' },
      ],
    },
    {
      id: 'callControl',
      title: 'Call Control',
      description: 'Managing the flow of the conversation without dominating it',
      scoreBands: [
        { range: '7+', label: 'Good', color: 'good', description: 'Talk time 40-50%, regular check-ins, balanced flow' },
        { range: '5-6', label: 'Focus', color: 'focus', description: 'Slightly over-talking but aware, some check-ins' },
        { range: '<5', label: 'Alert', color: 'alert', description: '60%+ talk time, long monologues, no check-ins' },
      ],
      whatGoodLooksLike: [
        'Regular check-ins every 30s',
        'Breaking up explanations with questions',
        'Steering back when off-topic',
        'Letting them lead while keeping structure',
      ],
      scriptsAndPhrases: [
        { script: 'Does that make sense so far?' },
        { script: 'What are your thoughts on that?' },
        { script: 'I want to make sure I\'m not wasting your time - can we come back to...?' },
        { script: 'That\'s a great question - before I answer, can I ask why that\'s important to you?' },
      ],
      commonMistakes: [
        '60s+ monologues without check-ins',
        'Letting technical issues derail the call',
        'Talking AT them rather than WITH them',
        'Not redirecting when conversation wanders',
      ],
      realExamples: [
        { type: 'good', text: '48% talk time, let the prospect do most of the talking. Created space for a 60s customer story by asking good questions and staying quiet.' },
        { type: 'bad', text: '78% talk time and 78s monologue. Prospect couldn\'t get a word in. This was a presentation, not a conversation.' },
      ],
    },
    {
      id: 'toneEnergy',
      title: 'Tone & Energy',
      description: 'How you sound - pace, warmth, confidence',
      scoreBands: [
        { range: '7+', label: 'Good', color: 'good', description: '125-145 wpm, conversational, matches prospect energy' },
        { range: '5-6', label: 'Focus', color: 'focus', description: 'Slightly fast or flat, not quite matching prospect' },
        { range: '<5', label: 'Alert', color: 'alert', description: '160+ wpm, monotone, or nervous energy' },
      ],
      whatGoodLooksLike: [
        'Matches the prospect\'s energy',
        'Conversational, not scripted',
        'Confident but not pushy',
        'Slows down on key points',
      ],
      scriptsAndPhrases: [
        { context: 'Tip', script: 'Pause after important points' },
        { context: 'Tip', script: 'Vary your pace (slow for value, natural for rapport)' },
        { context: 'Tip', script: 'Smile when you speak (they can hear it)' },
        { context: 'Tip', script: 'Breathe between sentences' },
      ],
      commonMistakes: [
        '180+ wpm machine gun delivery',
        'Monotone robot voice',
        'Not matching the prospect\'s energy',
        'Sounding nervous or desperate',
        'Being too casual with serious prospects',
      ],
      realExamples: [
        { type: 'good', text: '130 wpm, perfect pace. Patient with detailed questions, matched the prospect\'s analytical style without losing energy.' },
        { type: 'bad', text: '192 wpm - way too fast. Prospect was busy and the speed made them more stressed. Sounded like a telemarketer, not a consultant.' },
      ],
    },
    {
      id: 'valueProp',
      title: 'Value Prop',
      description: 'Connecting what you do to what THEY care about',
      scoreBands: [
        { range: '7+', label: 'Good', color: 'good', description: 'Connected features to their specific outcomes' },
        { range: '5-6', label: 'Focus', color: 'focus', description: 'Explained features but didn\'t land the WHY' },
        { range: '<5', label: 'Alert', color: 'alert', description: 'Feature dump with no connection to their world' },
      ],
      whatGoodLooksLike: [
        'Links features to their situation',
        'Asks what it would mean for them',
        'Uses their language back to them',
        'Paints a picture of the outcome',
      ],
      scriptsAndPhrases: [
        { script: 'Based on what you said about [their challenge], imagine if [outcome]...' },
        { script: 'You mentioned your abandonment flows aren\'t reaching everyone - we\'re seeing brands recover 200% more from those same flows. What would that mean for your Q2?' },
        { script: 'So your Klaviyo is set up, the flows are built - but there\'s a gap. Safari kills cookies after 7 days. Someone browses Monday, comes back Tuesday week - Klaviyo can\'t see them. That\'s revenue you\'re set up to capture but can\'t reach.' },
        { script: 'What would it mean for your business if you could fix that?' },
      ],
      commonMistakes: [
        'Feature dumping (we do X, Y, Z...)',
        'Not connecting to their specific situation',
        'Assuming they\'ll connect the dots',
        'Using jargon they don\'t understand',
        'Talking about YOU not THEM',
      ],
      realExamples: [
        { type: 'good', text: 'Connected features to the prospect\'s situation effectively. Made the value relevant and actionable - "based on what you just told me about X, this is what that would mean for you."' },
        { type: 'bad', text: 'Explained features but didn\'t land the WHY. Left the prospect to connect the dots themselves. No "so what" moment.' },
      ],
    },
    {
      id: 'objections',
      title: 'Objection Handling',
      description: 'Responding to pushback without getting defensive',
      scoreBands: [
        { range: '7+', label: 'Good', color: 'good', description: 'Acknowledged concern, explored it, moved forward' },
        { range: '5-6', label: 'Focus', color: 'focus', description: 'Handled it but didn\'t dig deeper' },
        { range: '<5', label: 'Alert', color: 'alert', description: 'Got defensive or steamrolled past it' },
      ],
      whatGoodLooksLike: [
        'Acknowledges the concern',
        'Gets curious about the underlying reason',
        'Doesn\'t get defensive',
        'Pivots back to value',
      ],
      scriptsAndPhrases: [
        { context: '"Send me an email"', script: 'Absolutely. So I send you something relevant - what\'s the one thing that would make you open it?' },
        { context: '"We already have something similar"', script: 'What specifically does [their tool] do for your email flows?' },
        { context: '"Not interested right now"', script: 'Fair enough. Quick question - are you happy with what you\'re seeing from your current setup versus your site traffic?' },
        { context: '"We\'re cutting budget"', script: 'Makes sense. Worth knowing - this isn\'t additional spend, it\'s recovering revenue from tools you\'re already paying for.' },
        { context: '"Klaviyo works fine"', script: 'Good to hear. When you compare your site traffic to your flow sends, do the numbers add up?' },
      ],
      commonMistakes: [
        'Getting defensive or argumentative',
        'Ignoring the objection and ploughing on',
        'Accepting "send me an email" at face value',
        'Not asking WHY they have that concern',
        'Giving up too easily',
      ],
      realExamples: [
        { type: 'good', text: 'Handled a skeptical prospect well. Didn\'t get defensive, acknowledged their hesitation, and asked what it would take to change their mind.' },
        { type: 'bad', text: 'Two calls and still not uncovering the real blocker. Needed to ask directly: "We\'ve spoken twice now - what\'s actually holding you back?"' },
      ],
    },
    {
      id: 'close',
      title: 'Close',
      description: 'Getting a specific commitment for next steps',
      scoreBands: [
        { range: '7+', label: 'Good', color: 'good', description: 'Demo booked with specific day/time' },
        { range: '5-6', label: 'Focus', color: 'focus', description: 'Follow-up scheduled but vague' },
        { range: '<5', label: 'Alert', color: 'alert', description: 'No next step or just "I\'ll send an email"' },
      ],
      whatGoodLooksLike: [
        'Specific day and time offered',
        'Confident ask, no hesitation',
        'Confirms what they want to see',
        'Locks it in before hanging up',
      ],
      scriptsAndPhrases: [
        { script: 'Would Thursday at 2pm work for a quick demo?' },
        { script: 'How\'s your diary looking Tuesday afternoon?' },
        { script: 'I think a 15-minute demo would show you more than another email - how\'s Friday morning?' },
        { script: 'Before we hang up - anything specific you want me to focus on in the demo?' },
        { script: 'Great, Thursday 2pm it is. I\'ll send a calendar invite now - is [email] the best one to use?' },
      ],
      commonMistakes: [
        'Vague close ("I\'ll send you an email")',
        'Not asking for a specific time',
        'Giving too many options (paradox of choice)',
        'Not confirming before hanging up',
        'Hesitating or apologising for asking',
      ],
      realExamples: [
        { type: 'good', text: '"Would Friday afternoon work?" - straight to booking. No hesitation, specific day offered, demo secured in under 6 minutes.' },
        { type: 'bad', text: 'After 21 minutes of solid engagement, only got an email follow-up. Should have pushed: "You\'ve got great questions - how about a proper demo Thursday?"' },
      ],
    },
  ],

  goldenRules: [
    { number: 1, title: 'Under 50% talk time', description: "If you're talking more than half the call, you're pitching, not discovering" },
    { number: 2, title: 'Max 30s before a question', description: 'Break up explanations with check-ins' },
    { number: 3, title: 'Qualify before pitching', description: '"Are you the person who looks after...?"' },
    { number: 4, title: 'Slow down', description: '130-140 wpm lands better than 180 wpm' },
    { number: 5, title: 'Specific close', description: 'Day and time, not "I\'ll send an email"' },
  ],
};
