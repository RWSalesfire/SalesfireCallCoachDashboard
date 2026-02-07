'use client';

import { DashboardData } from '@/types';
import StatCard from '@/components/ui/StatCard';
import WeeklyCallCard from '@/components/weekly/WeeklyCallCard';

interface LibraryViewProps {
  data: DashboardData;
}

export default function LibraryView({ data }: LibraryViewProps) {
  const { libraryData } = data;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard value={libraryData.callsReviewed} label="Calls Reviewed" />
        <StatCard value={libraryData.avgOverall} label="Avg Score" suffix="/10" />
        <StatCard value={libraryData.demosBooked} label="Demos Booked" />
      </div>

      {/* Call List */}
      <div>
        <h2 className="text-lg font-semibold text-sf-dark mb-4">Archived Calls</h2>
        {libraryData.calls.length > 0 ? (
          <div className="space-y-3">
            {libraryData.calls.map((call) => (
              <WeeklyCallCard key={call.id} call={call} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-card text-center">
            <p className="text-sf-secondary">No archived calls older than 30 days.</p>
          </div>
        )}
      </div>
    </div>
  );
}
