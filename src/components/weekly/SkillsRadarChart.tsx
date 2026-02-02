'use client';

import { RadarScores } from '@/types';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface SkillsRadarChartProps {
  scores: RadarScores;
}

export default function SkillsRadarChart({ scores }: SkillsRadarChartProps) {
  const data = [
    { subject: 'Gatekeeper', score: scores.gatekeeper, fullMark: 10 },
    { subject: 'Opener', score: scores.opener, fullMark: 10 },
    { subject: 'Discovery', score: scores.discovery, fullMark: 10 },
    { subject: 'The WHY', score: scores.theWhy, fullMark: 10 },
    { subject: 'Objections', score: scores.objections, fullMark: 10 },
    { subject: 'Close', score: scores.close, fullMark: 10 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-card">
      <h3 className="text-lg font-semibold text-sf-dark mb-4">Skills Overview</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fill: '#6B7280', fontSize: 10 }}
              tickCount={6}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#5EECD4"
              fill="#5EECD4"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              formatter={(value: number) => [value.toFixed(1), 'Score']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
