'use client';

import { WeeklyData } from '@/types';

interface WeeklySummaryStatsProps {
  data: WeeklyData;
}

function ChangeIndicator({ change, suffix = '' }: { change: number; suffix?: string }) {
  if (change === 0) return <span className="text-sf-secondary">-</span>;

  const isPositive = change > 0;
  return (
    <span className={`text-sm font-medium ${isPositive ? 'text-sf-good' : 'text-sf-focus'}`}>
      {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}{suffix}
    </span>
  );
}

export default function WeeklySummaryStats({ data }: WeeklySummaryStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl p-6 shadow-card">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-sf-dark">{data.callsReviewed}</span>
        </div>
        <p className="text-sm text-sf-secondary mt-1">Calls Reviewed</p>
        <p className="text-xs text-sf-secondary">this week</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-card">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-sf-dark">{data.topScore.toFixed(1)}</span>
        </div>
        <p className="text-sm text-sf-secondary mt-1">Top Score</p>
        <p className="text-xs text-sf-secondary">best call this week</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-card">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-sf-dark">{data.avgOverall.toFixed(1)}</span>
          <ChangeIndicator change={data.overallChange} />
        </div>
        <p className="text-sm text-sf-secondary mt-1">Avg Score</p>
        <p className="text-xs text-sf-secondary">from last week</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-card">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-sf-dark">{data.avgFocusArea.toFixed(1)}</span>
          <ChangeIndicator change={data.focusAreaChange} />
        </div>
        <p className="text-sm text-sf-secondary mt-1">{data.focusAreaName} Score</p>
        <p className="text-xs text-sf-secondary">focus area</p>
      </div>
    </div>
  );
}
