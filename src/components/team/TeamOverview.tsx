'use client';

import Link from 'next/link';
import { TeamOverviewData } from '@/lib/teamData';
import SuperpowersGrid from './SuperpowersGrid';
import Leaderboard from './Leaderboard';
import TeamAveragesGrid from './TeamAveragesGrid';

interface TeamOverviewProps {
  data: TeamOverviewData;
}

export default function TeamOverview({ data }: TeamOverviewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-sf-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-sf-dark">Team Overview</h1>
              <p className="text-sm text-sf-secondary">This week&apos;s performance</p>
            </div>
            <Link href="/" className="text-sm text-sf-dark hover:underline">
              &larr; Back to SDRs
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section>
          <SuperpowersGrid superpowers={data.superpowers} />
        </section>
        <section>
          <Leaderboard sdrs={data.sdrs} />
        </section>
        <section>
          <TeamAveragesGrid averages={data.teamAverages} />
        </section>
      </main>

      <footer className="bg-white border-t border-sf-border mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-sf-secondary text-center">Salesfire Call Coaching Dashboard</p>
        </div>
      </footer>
    </div>
  );
}
