'use client';

import { DashboardData } from '@/types';
import StatCard from '@/components/ui/StatCard';
import DailyCallCard from './DailyCallCard';
import FocusBanner from './FocusBanner';
import FocusPriorityCards from './FocusPriorityCards';
import { calculateFocusPriorities } from '@/lib/focusCalculation';

interface DailyViewProps {
  data: DashboardData;
}

export default function DailyView({ data }: DailyViewProps) {
  const { dailyStats, yesterdaysCalls, focusToday, teamAvgConnectionRate } = data;

  const isAboveAverage = dailyStats.connectionRate > teamAvgConnectionRate;
  const focusPriorities = calculateFocusPriorities(data.weeklyData.calls);

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            value={dailyStats.totalDials}
            label="Total Dials"
          />
          <StatCard
            value={dailyStats.connectedCalls}
            label="Connected"
          />
          <StatCard
            value={dailyStats.connectionRate}
            label="Connection Rate"
            suffix="%"
            comparison={{
              value: dailyStats.connectionRate,
              isHigher: isAboveAverage,
            }}
          />
          <StatCard
            value={teamAvgConnectionRate}
            label="Team Avg"
            suffix="%"
          />
        </div>
      </section>

      {/* 3 Things to Focus On */}
      {focusPriorities.length > 0 && (
        <section>
          <FocusPriorityCards priorities={focusPriorities} />
        </section>
      )}

      {/* Yesterday's Calls */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold text-sf-dark">Yesterday&apos;s Calls</h2>
          <span className="text-sm text-sf-secondary">{yesterdaysCalls.length} calls</span>
        </div>
        <div className="space-y-3">
          {yesterdaysCalls.length > 0 ? (
            yesterdaysCalls.map((call) => (
              <DailyCallCard key={call.id} call={call} />
            ))
          ) : (
            <div className="bg-sf-card rounded-xl p-8 text-center">
              <p className="text-sf-secondary">
                No connected calls yesterday. Check back after today&apos;s session.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Focus for Today */}
      <section>
        <FocusBanner focus={focusToday} />
      </section>
    </div>
  );
}
