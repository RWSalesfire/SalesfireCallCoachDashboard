import { Call, FocusPriority } from '@/types';

const AREA_LABELS: Record<string, string> = {
  opener: 'Opener',
  personalisation: 'Personalisation',
  discovery: 'Discovery',
  callControl: 'Call Control',
  toneEnergy: 'Tone & Energy',
  valueProp: 'Value Prop',
  objections: 'Objections',
  close: 'Close',
};

const FOCUS_AREAS = ['opener', 'personalisation', 'discovery', 'callControl', 'toneEnergy', 'valueProp', 'objections', 'close'];

export function calculateFocusPriorities(calls: Call[]): FocusPriority[] {
  const areaScores: Record<string, number[]> = {};

  for (const area of FOCUS_AREAS) {
    areaScores[area] = [];
  }

  for (const call of calls) {
    if (!call.scores) continue;
    const scores = call.scores as Record<string, number | 'N/A'>;
    for (const area of FOCUS_AREAS) {
      const val = scores[area];
      if (val !== undefined && val !== 'N/A') {
        areaScores[area].push(val as number);
      }
    }
  }

  const areaAverages = FOCUS_AREAS
    .filter((area) => areaScores[area].length >= 2)
    .map((area) => {
      const scores = areaScores[area];
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return { area, avg };
    })
    .sort((a, b) => a.avg - b.avg);

  const top3 = areaAverages.slice(0, 3);

  return top3.map((item, idx) => {
    let tryNext = `Focus on improving ${AREA_LABELS[item.area]} in your next calls.`;

    for (let i = calls.length - 1; i >= 0; i--) {
      const breakdown = calls[i].areaBreakdown;
      if (breakdown && breakdown[item.area]) {
        tryNext = breakdown[item.area].tryNext;
        break;
      }
    }

    return {
      rank: (idx + 1) as 1 | 2 | 3,
      area: item.area,
      areaLabel: AREA_LABELS[item.area],
      avgScore: Math.round(item.avg * 10) / 10,
      tryNext,
    };
  });
}
