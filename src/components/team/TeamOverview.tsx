'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Timeframe } from '@/types';
import { TeamOverviewData, SDRTeamStats } from '@/lib/teamData';
import SuperpowersGrid from './SuperpowersGrid';
import Leaderboard from './Leaderboard';
import TeamAveragesGrid from './TeamAveragesGrid';
import BattleCardsView from '@/components/battlecards/BattleCardsView';

const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  thisWeek: "This week's performance",
  last4Weeks: 'Last 4 weeks performance',
  last3Months: 'Last 3 months performance',
};

const PREV_TIMEFRAME: Record<Timeframe, Timeframe | null> = {
  thisWeek: null,
  last4Weeks: 'thisWeek',
  last3Months: 'last4Weeks',
};

function getPositionMap(sdrs: SDRTeamStats[]): Record<string, number> {
  const map: Record<string, number> = {};
  sdrs.forEach((sdr, idx) => { map[sdr.slug] = idx; });
  return map;
}

interface TeamOverviewProps {
  data: TeamOverviewData;
}

type Tab = 'overview' | 'battlecards';

export default function TeamOverview({ data }: TeamOverviewProps) {
  const [tab, setTab] = useState<Tab>('overview');
  const [timeframe, setTimeframe] = useState<Timeframe>('thisWeek');

  const positionChanges = useMemo(() => {
    const prev = PREV_TIMEFRAME[timeframe];
    if (!prev) return undefined;
    const prevPositions = getPositionMap(data.sdrsByTimeframe[prev]);
    const currPositions = getPositionMap(data.sdrsByTimeframe[timeframe]);
    const changes: Record<string, number> = {};
    for (const slug of Object.keys(currPositions)) {
      // positive = moved up (lower index), negative = moved down
      changes[slug] = (prevPositions[slug] ?? 0) - (currPositions[slug] ?? 0);
    }
    return changes;
  }, [timeframe, data.sdrsByTimeframe]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-sf-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-sf-dark">
                {tab === 'overview' ? 'Team Overview' : 'Battle Cards'}
              </h1>
              <p className="text-sm text-sf-secondary">
                {tab === 'overview' ? TIMEFRAME_LABELS[timeframe] : 'Quick-reference guides to sharpen your calls'}
              </p>
            </div>
            <Link href="/" className="text-sm text-sf-dark hover:underline">
              &larr; Back to SDRs
            </Link>
          </div>
          <div className="flex gap-1 mt-3">
            {([
              { value: 'overview' as Tab, label: 'Overview' },
              { value: 'battlecards' as Tab, label: 'Battle Cards' },
            ]).map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  tab === t.value
                    ? 'bg-sf-dark text-white'
                    : 'text-sf-secondary hover:text-sf-dark hover:bg-gray-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {tab === 'overview' ? (
          <>
            <section>
              <SuperpowersGrid
                superpowersByTimeframe={data.superpowersByTimeframe}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
              />
            </section>
            <section key={timeframe}>
              <Leaderboard sdrs={data.sdrsByTimeframe[timeframe]} positionChanges={positionChanges} />
            </section>
            <section>
              <TeamAveragesGrid averages={data.teamAverages} />
            </section>
          </>
        ) : (
          <BattleCardsView />
        )}
      </main>

      <footer className="bg-white border-t border-sf-border mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-sf-secondary text-center">Salesfire Call Coaching Dashboard</p>
        </div>
      </footer>
    </div>
  );
}
