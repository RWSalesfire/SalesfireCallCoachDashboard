'use client';

import Link from 'next/link';
import { SDRTeamStats } from '@/lib/teamData';
import ScoreBadge from '@/components/ui/ScoreBadge';

interface LeaderboardProps {
  sdrs: SDRTeamStats[];
  positionChanges?: Record<string, number>; // slug → positions moved (positive = moved up)
}

const MEDALS = ['\u{1F947}', '\u{1F948}', '\u{1F949}'];

function PositionChange({ change }: { change: number }) {
  if (change === 0) return <span className="text-xs text-sf-secondary ml-1">—</span>;
  const isUp = change > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold ml-1.5 ${
        isUp ? 'text-sf-good' : 'text-red-500'
      }`}
    >
      <svg
        width="8"
        height="8"
        viewBox="0 0 10 10"
        fill="currentColor"
        className={isUp ? '' : 'rotate-180'}
      >
        <path d="M5 1L9 7H1L5 1Z" />
      </svg>
      {Math.abs(change)}
    </span>
  );
}

export default function Leaderboard({ sdrs, positionChanges }: LeaderboardProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <h2 className="text-xl font-semibold text-sf-dark mb-4">Leaderboard</h2>
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sf-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-sf-secondary w-12">#</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-sf-secondary">SDR</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-sf-secondary">Avg Score</th>
            </tr>
          </thead>
          <tbody>
            {sdrs.map((sdr, idx) => (
              <tr
                key={sdr.slug}
                className={`animate-fade-in ${idx % 2 === 0 ? 'bg-white' : 'bg-sf-card/30'}`}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <td className="py-3 px-4 text-lg whitespace-nowrap">
                  <span className="inline-flex items-center">
                    {idx < 3 ? MEDALS[idx] : <span className="text-sm text-sf-secondary">{idx + 1}</span>}
                    {positionChanges && positionChanges[sdr.slug] !== undefined && (
                      <PositionChange change={positionChanges[sdr.slug]} />
                    )}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Link href={`/${sdr.slug}/${today}`} className="font-medium text-sf-body hover:text-sf-dark">
                    {sdr.name}
                  </Link>
                </td>
                <td className="py-3 px-4 text-center">
                  <ScoreBadge score={sdr.avgOverall} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
