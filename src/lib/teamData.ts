import { sdrList, getSampleDataForSDR } from '@/data/sampleData';
import { RadarScores } from '@/types';

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
  superpowers: TeamSuperpower[];
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

  // Deterministic weekly trend values per area (sample data)
  const SAMPLE_TRENDS: Record<string, number> = {
    opener: 0.3,
    personalisation: -0.1,
    discovery: 0.4,
    callControl: 0.2,
    toneEnergy: -0.2,
    valueProp: 0.5,
    objections: 0.1,
    close: -0.3,
  };

  // Find superpowers (best SDR per area, excluding gatekeeper)
  const superpowers: TeamSuperpower[] = SUPERPOWER_AREAS.map((area) => {
    let best = { name: '', slug: '', score: 0 };
    for (const sdr of sdrs) {
      const score = (sdr.radarScores as unknown as Record<string, number>)[area] || 0;
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
      trend: SAMPLE_TRENDS[area] || 0,
    };
  });

  // Team averages per area
  const teamAverages: Record<string, number> = {};
  for (const area of ALL_AREAS) {
    const scores = sdrs.map((s) => (s.radarScores as unknown as Record<string, number>)[area] || 0);
    teamAverages[area] = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0;
  }

  return { sdrs, superpowers, teamAverages };
}
