'use client';

import { DashboardData } from '@/types';
import WeeklySummaryStats from './WeeklySummaryStats';
import SkillsRadarChart from './SkillsRadarChart';
import WeeklyCallCard from './WeeklyCallCard';
import ProgressSection from './ProgressSection';
import WeekFocusCard from './WeekFocusCard';
import PlaybookSection from './PlaybookSection';

interface WeeklyViewProps {
  data: DashboardData;
}

export default function WeeklyView({ data }: WeeklyViewProps) {
  const { weeklyData, playbook } = data;

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <section>
        <WeeklySummaryStats data={weeklyData} />
      </section>

      {/* Radar Chart and Focus */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillsRadarChart scores={weeklyData.radarScores} />
        <WeekFocusCard focus={weeklyData.weekFocus} />
      </section>

      {/* This Week's Calls */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold text-sf-dark">This Week&apos;s Calls</h2>
          <span className="text-sm text-sf-secondary">{weeklyData.calls.length} calls</span>
        </div>
        <div className="space-y-3">
          {weeklyData.calls.length > 0 ? (
            weeklyData.calls.map((call) => (
              <WeeklyCallCard key={call.id} call={call} />
            ))
          ) : (
            <div className="bg-sf-card rounded-xl p-8 text-center">
              <p className="text-sf-secondary">
                No calls reviewed this week yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Progress */}
      <section>
        <h2 className="text-xl font-semibold text-sf-dark mb-4">Progress</h2>
        <ProgressSection data={weeklyData} />
      </section>

      {/* Playbook */}
      <section>
        <PlaybookSection playbook={playbook} />
      </section>
    </div>
  );
}
