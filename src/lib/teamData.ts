import { sdrList, getSampleDataForSDR } from '@/data/sampleData';
import { RadarScores, Timeframe } from '@/types';

export interface SDRTeamStats {
  name: string;
  slug: string;
  avgOverall: number;
  demosBooked: number;
  callsReviewed: number;
  radarScores: RadarScores;
}

export interface TeamSuperpower {
  area: string;
  areaLabel: string;
  sdrName: string;
  sdrSlug: string;
  score: number;
  trend: number; // weekly change (positive = improving, negative = declining)
}

export interface TeamOverviewData {
  sdrs: SDRTeamStats[];
  sdrsByTimeframe: Record<Timeframe, SDRTeamStats[]>;
  superpowers: TeamSuperpower[];
  superpowersByTimeframe: Record<Timeframe, TeamSuperpower[]>;
  teamAverages: Record<string, number>;
}

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

const SUPERPOWER_AREAS = ['opener', 'personalisation', 'discovery', 'callControl', 'toneEnergy', 'valueProp', 'objections', 'close'];
const ALL_AREAS = ['gatekeeper', ...SUPERPOWER_AREAS];

// Trend magnitudes increase with longer timeframes
const TRENDS_BY_TIMEFRAME: Record<Timeframe, Record<string, number>> = {
  thisWeek: {
    opener: 0.3,
    personalisation: -0.1,
    discovery: 0.4,
    callControl: 0.2,
    toneEnergy: -0.2,
    valueProp: 0.5,
    objections: 0.1,
    close: -0.3,
  },
  last4Weeks: {
    opener: 0.7,
    personalisation: -0.4,
    discovery: 0.9,
    callControl: 0.5,
    toneEnergy: 0.3,
    valueProp: 1.1,
    objections: -0.2,
    close: 0.6,
  },
  last3Months: {
    opener: 1.2,
    personalisation: 0.8,
    discovery: 1.5,
    callControl: -0.3,
    toneEnergy: 0.9,
    valueProp: 1.8,
    objections: 0.6,
    close: 1.1,
  },
};

// Score adjustments per timeframe per SDR slug — shifts who "wins" each area across timeframes
const SCORE_ADJUSTMENTS: Record<Timeframe, Record<string, Record<string, number>>> = {
  thisWeek: {},
  last4Weeks: {
    katie: { opener: -0.3, discovery: 0.2, close: -0.4 },
    sally: { opener: 0.4, valueProp: -0.3, objections: 0.5 },
    jack: { personalisation: 0.3, toneEnergy: 0.4, close: 0.3 },
    steph: { discovery: -0.2, callControl: 0.3, valueProp: 0.2 },
  },
  last3Months: {
    katie: { opener: -0.5, personalisation: -0.3, valueProp: 0.4 },
    sally: { opener: 0.6, discovery: -0.4, objections: 0.7 },
    jack: { personalisation: 0.5, toneEnergy: 0.6, close: 0.5 },
    steph: { discovery: 0.3, callControl: 0.5, valueProp: -0.2 },
  },
};

// Leaderboard adjustments per timeframe — shifts avgOverall, demosBooked, callsReviewed
const LEADERBOARD_ADJUSTMENTS: Record<Timeframe, Record<string, { score: number; demos: number; calls: number }>> = {
  thisWeek: {},
  last4Weeks: {
    katie: { score: 0.3, demos: 5, calls: 12 },
    sally: { score: -0.2, demos: 4, calls: 10 },
    jack: { score: 0.1, demos: 6, calls: 14 },
    steph: { score: 0.4, demos: 3, calls: 11 },
  },
  last3Months: {
    katie: { score: 0.5, demos: 14, calls: 38 },
    sally: { score: 0.1, demos: 10, calls: 30 },
    jack: { score: -0.1, demos: 16, calls: 42 },
    steph: { score: 0.6, demos: 8, calls: 35 },
  },
};

function generateSdrsForTimeframe(
  baseSdrs: SDRTeamStats[],
  timeframe: Timeframe
): SDRTeamStats[] {
  const adjustments = LEADERBOARD_ADJUSTMENTS[timeframe];
  const adjusted = baseSdrs.map((sdr) => {
    const adj = adjustments[sdr.slug];
    if (!adj) return { ...sdr };
    return {
      ...sdr,
      avgOverall: Math.round((sdr.avgOverall + adj.score) * 10) / 10,
      demosBooked: sdr.demosBooked + adj.demos,
      callsReviewed: sdr.callsReviewed + adj.calls,
    };
  });
  adjusted.sort((a, b) => b.avgOverall - a.avgOverall);
  return adjusted;
}

function generateSuperpowersForTimeframe(
  sdrs: SDRTeamStats[],
  timeframe: Timeframe
): TeamSuperpower[] {
  const trends = TRENDS_BY_TIMEFRAME[timeframe];
  const adjustments = SCORE_ADJUSTMENTS[timeframe];

  return SUPERPOWER_AREAS.map((area) => {
    let best = { name: '', slug: '', score: 0 };
    for (const sdr of sdrs) {
      const baseScore = (sdr.radarScores as unknown as Record<string, number>)[area] || 0;
      const adj = adjustments[sdr.slug]?.[area] || 0;
      const score = Math.round((baseScore + adj) * 10) / 10;
      if (score > best.score) {
        best = { name: sdr.name, slug: sdr.slug, score };
      }
    }
    return {
      area,
      areaLabel: AREA_LABELS[area],
      sdrName: best.name,
      sdrSlug: best.slug,
      score: best.score,
      trend: trends[area] || 0,
    };
  });
}

export function getTeamOverviewData(date: string): TeamOverviewData {
  const sdrs: SDRTeamStats[] = [];

  for (const sdr of sdrList) {
    const data = getSampleDataForSDR(sdr.slug, date);
    if (!data) continue;

    sdrs.push({
      name: sdr.name,
      slug: sdr.slug,
      avgOverall: data.weeklyData.avgOverall,
      demosBooked: data.weeklyData.demosBooked,
      callsReviewed: data.weeklyData.callsReviewed,
      radarScores: data.weeklyData.radarScores,
    });
  }

  // Sort by avgOverall descending for leaderboard
  sdrs.sort((a, b) => b.avgOverall - a.avgOverall);

  // Generate superpowers for each timeframe
  const superpowersByTimeframe: Record<Timeframe, TeamSuperpower[]> = {
    thisWeek: generateSuperpowersForTimeframe(sdrs, 'thisWeek'),
    last4Weeks: generateSuperpowersForTimeframe(sdrs, 'last4Weeks'),
    last3Months: generateSuperpowersForTimeframe(sdrs, 'last3Months'),
  };

  // Keep backward compat: superpowers = thisWeek
  const superpowers = superpowersByTimeframe.thisWeek;

  // Team averages per area
  const teamAverages: Record<string, number> = {};
  for (const area of ALL_AREAS) {
    const scores = sdrs.map((s) => (s.radarScores as unknown as Record<string, number>)[area] || 0);
    teamAverages[area] = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0;
  }

  const sdrsByTimeframe: Record<Timeframe, SDRTeamStats[]> = {
    thisWeek: generateSdrsForTimeframe(sdrs, 'thisWeek'),
    last4Weeks: generateSdrsForTimeframe(sdrs, 'last4Weeks'),
    last3Months: generateSdrsForTimeframe(sdrs, 'last3Months'),
  };

  return { sdrs, sdrsByTimeframe, superpowers, superpowersByTimeframe, teamAverages };
}
