'use client';

import { DashboardData } from '@/types';
import StatCard from '@/components/ui/StatCard';
import SkillsRadarChart from '@/components/weekly/SkillsRadarChart';
import FocusBanner from './FocusBanner';
import FocusPriorityCards from './FocusPriorityCards';
import { calculateFocusPriorities } from '@/lib/focusCalculation';

interface DailyViewProps {
  data: DashboardData;
}

export default function DailyView({ data }: DailyViewProps) {
  const { dailyStats, focusToday, teamAvgConnectionRate } = data;

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

      {/* Skills Overview Radar */}
      <section>
        <SkillsRadarChart scores={data.allTimeRadarScores} />
      </section>

      {/* 3 Things to Focus On */}
      {focusPriorities.length > 0 && (
        <section>
          <FocusPriorityCards priorities={focusPriorities} />
        </section>
      )}

      {/* Focus for Today */}
      <section>
        <FocusBanner focus={focusToday} />
      </section>
    </div>
  );
}
