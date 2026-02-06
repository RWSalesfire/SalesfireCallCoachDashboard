'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardData } from '@/types';
import ViewToggle from '@/components/ui/ViewToggle';
import DailyView from '@/components/daily/DailyView';
import WeeklyView from '@/components/weekly/WeeklyView';

interface DashboardProps {
  data: DashboardData;
  initialView?: 'daily' | 'weekly';
}

export default function Dashboard({ data, initialView = 'daily' }: DashboardProps) {
  const [currentView, setCurrentView] = useState<'daily' | 'weekly'>(initialView);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-sf-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-sf-dark">{data.sdrName}</h1>
              <p className="text-sm text-sf-secondary">
                {currentView === 'daily'
                  ? formatDate(data.date)
                  : `Week ${data.weeklyData.weekNumber}, 2026`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/team" className="text-sm text-sf-secondary hover:text-sf-dark">
                Team
              </Link>
              <Link href="/guide" className="text-sm text-sf-secondary hover:text-sf-dark">
                Guide
              </Link>
              <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'daily' ? (
          <DailyView data={data} />
        ) : (
          <WeeklyView data={data} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-sf-border mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-sf-secondary text-center">
            Salesfire Call Coaching Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}
