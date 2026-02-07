'use client';

import { DashboardData } from '@/types';
import StatCard from '@/components/ui/StatCard';
import WeeklyCallCard from '@/components/weekly/WeeklyCallCard';

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
        <h2 className="text-lg font-semibold text-sf-dark mb-4">All Calls</h2>
        {last30DaysData.calls.length > 0 ? (
          <div className="space-y-3">
            {last30DaysData.calls.map((call) => (
              <WeeklyCallCard key={call.id} call={call} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-card text-center">
            <p className="text-sf-secondary">No analyzed calls in the last 30 days.</p>
          </div>
        )}
      </div>
    </div>
  );
}
