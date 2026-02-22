'use client';

import { DashboardData } from '@/types';
import StatCard from '@/components/ui/StatCard';
import WeeklyCallCard from '@/components/weekly/WeeklyCallCard';
import EmptyState from '@/components/ui/EmptyState';

interface Last30DaysViewProps {
  data: DashboardData;
}

export default function Last30DaysView({ data }: Last30DaysViewProps) {
  const { last30DaysData } = data;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard value={last30DaysData.callsReviewed} label="Calls Reviewed" />
        <StatCard value={last30DaysData.avgOverall} label="Avg Score" suffix="/10" />
        <StatCard value={last30DaysData.demosBooked} label="Demos Booked" />
      </div>

      {/* Call List */}
      <div>
        <h2 className="section-title mb-5">All Calls</h2>
        {last30DaysData.calls.length > 0 ? (
          <div className="space-y-3">
            {last30DaysData.calls.map((call) => (
              <WeeklyCallCard key={call.id} call={call} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📋"
            title="No calls in the last 30 days"
            description="Analysed calls from the past 30 days will appear here. Make some calls and we’ll surface them once they’re reviewed."
          />
        )}
      </div>
    </div>
  );
}
