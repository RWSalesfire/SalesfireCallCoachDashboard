'use client';

import Link from 'next/link';
import { SDRTeamStats } from '@/lib/teamData';
import ScoreBadge from '@/components/ui/ScoreBadge';

interface LeaderboardProps {
  sdrs: SDRTeamStats[];
}

const MEDALS = ['\u{1F947}', '\u{1F948}', '\u{1F949}'];

export default function Leaderboard({ sdrs }: LeaderboardProps) {
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
              <th className="text-center py-3 px-4 text-sm font-medium text-sf-secondary">Demos</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-sf-secondary">Calls Reviewed</th>
            </tr>
          </thead>
          <tbody>
            {sdrs.map((sdr, idx) => (
              <tr key={sdr.slug} className={idx % 2 === 0 ? 'bg-white' : 'bg-sf-card/30'}>
                <td className="py-3 px-4 text-lg">
                  {idx < 3 ? MEDALS[idx] : <span className="text-sm text-sf-secondary">{idx + 1}</span>}
                </td>
                <td className="py-3 px-4">
                  <Link href={`/${sdr.slug}/${today}`} className="font-medium text-sf-body hover:text-sf-dark">
                    {sdr.name}
                  </Link>
                </td>
                <td className="py-3 px-4 text-center">
                  <ScoreBadge score={sdr.avgOverall} />
                </td>
                <td className="py-3 px-4 text-center text-sm text-sf-body">{sdr.demosBooked}</td>
                <td className="py-3 px-4 text-center text-sm text-sf-body">{sdr.callsReviewed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
