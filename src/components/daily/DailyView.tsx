'use client';

import { DashboardData } from '@/types';
import FocusBanner from './FocusBanner';
import FocusPriorityCards from './FocusPriorityCards';
import WinOfTheWeek from './WinOfTheWeek';
import SkillsBarChart from './SkillsBarChart';
import { calculateFocusPriorities } from '@/lib/focusCalculation';

interface DailyViewProps {
  data: DashboardData;
}

export default function DailyView({ data }: DailyViewProps) {
  const { focusToday } = data;
  const focusPriorities = calculateFocusPriorities(data.weeklyData.calls);
  const focusCount = focusPriorities.length;
  const summaryLine =
    focusCount > 0
      ? `${focusCount} focus area${focusCount === 1 ? '' : 's'} today · Start with your win of the week below`
      : 'Start with your win of the week and today’s focus below';

  return (
    <div className="space-y-10">
      <p className="body-muted">{summaryLine}</p>

      {/* Win of the Week */}
      <section>
        <WinOfTheWeek calls={data.weeklyData.calls} />
      </section>

      {/* Skills This Week */}
      <section>
        <SkillsBarChart scores={data.weeklyData.radarScores} />
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
