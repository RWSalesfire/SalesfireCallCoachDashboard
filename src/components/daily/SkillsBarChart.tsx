'use client';

import { RadarScores } from '@/types';
import EmptyState from '@/components/ui/EmptyState';

interface SkillsBarChartProps {
  scores: RadarScores;
}

const skillLabels: Record<keyof RadarScores, string> = {
  gatekeeper: 'Gatekeeper',
  opener: 'Opener',
  personalisation: 'Personalisation',
  discovery: 'Discovery',
  callControl: 'Call Control',
  toneEnergy: 'Tone & Energy',
  valueProp: 'Value Prop',
  objections: 'Objections',
  close: 'Close',
};

function hasAnyScores(scores: RadarScores): boolean {
  return (Object.keys(skillLabels) as (keyof RadarScores)[]).some((key) => scores[key] > 0);
}

export default function SkillsBarChart({ scores }: SkillsBarChartProps) {
  if (!hasAnyScores(scores)) {
    return (
      <div>
        <h2 className="section-title mb-4">Skills This Week</h2>
        <EmptyState
          icon="📊"
          title="No skill scores yet"
          description="Once you have reviewed calls this week, your skill breakdown will appear here."
        />
      </div>
    );
  }

  const entries = (Object.keys(skillLabels) as (keyof RadarScores)[])
    .map((key) => ({
      key,
      label: skillLabels[key],
      score: scores[key],
    }))
    .sort((a, b) => a.score - b.score);

  const getBarColor = (score: number) => {
    if (score >= 7) return 'bg-sf-good';
    if (score >= 5) return 'bg-sf-focus';
    return 'bg-sf-alert';
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-emerald-700';
    if (score >= 5) return 'text-amber-700';
    return 'text-red-700';
  };

  return (
    <div className="bg-sf-card rounded-xl p-5 border border-sf-border">
      <h2 className="section-title mb-4">Skills This Week</h2>
      <div className="space-y-2.5">
        {entries.map(({ key, label, score }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs font-medium text-sf-body w-24 flex-shrink-0 text-right">
              {label}
            </span>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getBarColor(score)}`}
                style={{ width: `${(score / 10) * 100}%` }}
              />
            </div>
            <span className={`text-xs font-semibold w-7 text-right tabular-nums ${getScoreColor(score)}`}>
              {score.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
