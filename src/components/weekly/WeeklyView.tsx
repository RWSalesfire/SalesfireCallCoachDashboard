'use client';

import { DashboardData } from '@/types';
import WeeklySummaryStats from './WeeklySummaryStats';
import WeeklyCallCard from './WeeklyCallCard';
import ProgressSection from './ProgressSection';
import WeekFocusCard from './WeekFocusCard';
import PlaybookSection from './PlaybookSection';
import EmptyState from '@/components/ui/EmptyState';

interface WeeklyViewProps {
  data: DashboardData;
}

export default function WeeklyView({ data }: WeeklyViewProps) {
  const { weeklyData, playbook } = data;

  return (
    <div className="space-y-10">
      {/* Summary Stats */}
      <section>
        <WeeklySummaryStats data={weeklyData} />
      </section>

      {/* Week Focus */}
      <section>
        <WeekFocusCard focus={weeklyData.weekFocus} />
      </section>

      {/* This Week's Calls */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="section-title">This Week&apos;s Calls</h2>
          <span className="text-sm text-sf-secondary">{weeklyData.calls.length} calls</span>
        </div>
        <div className="space-y-3">
          {weeklyData.calls.length > 0 ? (
            weeklyData.calls.map((call) => (
              <WeeklyCallCard key={call.id} call={call} />
            ))
          ) : (
            <EmptyState
              icon="📞"
              title="No calls reviewed this week yet"
              description="Once calls are analysed, they’ll show up here so you can track progress and wins."
            />
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
