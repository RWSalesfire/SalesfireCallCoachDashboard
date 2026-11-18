// What's true about Salesfire, as confirmed by Russell (30 Oct - 18 Nov 2026).
// The scorer judges "explaining the problem" and "proof" against this, flags
// out-of-date claims, and the brief's figure guard treats these figures as
// approved. Update here when positioning changes; nothing else needs editing.

export const PRODUCT_FACTS = `AI Connect (for Klaviyo):
- What it does: re-matches shoppers the brand already knows (existing subscribers) when they come back on another device or after their cookie has gone, so they enter the abandonment flows they were missing. It does not add net-new subscribers or identities.
- The accurate problem: Klaviyo can't tell it's the same shopper on phone and laptop, and Safari clears its cookie after 7 days without a visit, so returning shoppers look like strangers and never enter browse or cart abandonment flows.
- Headline result: 140% more Klaviyo flow revenue (matches salesfire.co.uk/ai-connect).
- Ease: one line of code plus an API connection to Klaviyo, live in about 3 minutes, nothing for developers to do (useful in a code freeze), free proof of concept. In Q4 the ask is a demo now with a proof of concept in Q1, using peak numbers as the baseline.
- Guarantee: at least +20% flow revenue or no AI Connect fees, for brands with £1k+/month flow revenue, excluding welcome flows.
- Alongside server-side tracking (Littledata, Triple Whale, Polar, Elevar): Salesfire matches different visitors, so the two stack. Never call those tools weak.

Mailchimp prospects: the approved claim is a 40-50% uplift on abandonment flow revenue.

Published results (match to how the prospect's customers buy, not just the category):
Justmylook +116% Klaviyo flow revenue (cosmetics, repeat-purchase); Fashion Eyewear +321% browse abandonment revenue; OTTY Sleep +183%; Direct Soccer +330% daily flow revenue; Blush Boutique +318%; Moda in Pelle +281%; Heat Holders +100% email campaign revenue; Charles Clinkard +95%; Little Lies +91%.`;

// Lines reps were taught that are now wrong. The scorer may only flag these
// types, and the correct line always comes from here, word for word, so a
// brief never prints an AI-worded "correction". They don't lower the score.
export const OUT_OF_DATE_CLAIMS = {
  old_figure: {
    looks_like: 'Says AI Connect delivers 200% (the old script figure) or any other uplift figure for AI Connect that is not 140%.',
    correct_line: 'AI Connect brands see 140% more Klaviyo flow revenue on average.',
  },
  cookie_days: {
    looks_like: 'Says Klaviyo (or Mailchimp) cookies expire after 2-3 days, 14 days, or any set number of days.',
    correct_line: "Klaviyo can't tell it's the same shopper on their phone and laptop, and Safari clears the cookie after 7 days without a visit.",
  },
  net_new: {
    looks_like: 'Says AI Connect finds new subscribers, new emails or identifies brand-new visitors.',
    correct_line: 'AI Connect re-matches shoppers you already know when they come back on another device or after their cookie has gone.',
  },
  unapproved_result: {
    looks_like: 'Quotes a customer result or statistic about Salesfire that is not in the published results list, or attaches a result to the wrong retailer.',
    correct_line: 'Use a published result matched to how their customers buy, for example Justmylook +116% Klaviyo flow revenue.',
  },
} as const;

export type ClaimType = keyof typeof OUT_OF_DATE_CLAIMS;

// Figures a brief may repeat even if nobody said them on a call this week.
export const APPROVED_FIGURES = [
  '140%', '20%', '116%', '321%', '183%', '330%', '318%', '281%', '100%', '95%', '91%', '40-50%', '£1k',
];
