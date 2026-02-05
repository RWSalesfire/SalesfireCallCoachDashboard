# SDR Call Coaching Dashboard

A coaching dashboard for the Salesfire SDR team that analyses calls across 9 areas.

## Quick Start

1. Open `sdr-coaching-dashboard.html` in a browser to view
2. Deploy to Vercel: `vercel deploy --yes --public`

## Adding New Calls

Ask Claude:
> "Pull this week's calls from HubSpot for [SDR name] and add them to the dashboard"

Or provide transcripts manually:
> "Here's a call transcript for Jack - analyse it and add to the dashboard"

## Updating Stats

The dashboard auto-calculates:
- "3 Things to Focus On" from lowest scoring areas
- Team superpowers (highest scorer per area)
- Leaderboard rankings
- Radar chart averages

After adding calls, ask Claude to recalculate the averages.

## SDR Owner IDs (HubSpot)

| SDR | Owner ID |
|-----|----------|
| Katie Simpson | 79353482 |
| Jack Skeldon | 192524366 |
| Steph McCarthy | 91666198 |
| Sally Watson | 34452385 |

## The 9 Scoring Areas

1. **Gatekeeper** - Getting through to decision-maker
2. **Opener** - Permission + curiosity hook
3. **Personalisation** - Company-specific research
4. **Discovery** - Questions and listening
5. **Call Control** - Managing conversation flow
6. **Tone & Energy** - Pace and warmth
7. **Value Prop** - Connecting to their outcomes
8. **Objection Handling** - Responding to pushback
9. **Close** - Getting specific next steps

## Target Metrics

| Metric | Target |
|--------|--------|
| Talk Time | 40-50% |
| Talk Speed | 125-145 wpm |
| Monologue | Under 40s |
| Customer Story | 45s+ |

## Files

- `sdr-coaching-dashboard.html` - Main dashboard
- `Good-Call-vs-Bad-Call-Guide.docx` - Team training doc
- `CLAUDE.md` - Full project context for Claude
