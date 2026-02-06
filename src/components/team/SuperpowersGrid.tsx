'use client';

import { TeamSuperpower } from '@/lib/teamData';

interface SuperpowersGridProps {
  superpowers: TeamSuperpower[];
}

function TrendIndicator({ trend }: { trend: number }) {
  if (trend === 0) return null;
  const isUp = trend > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        isUp ? 'text-sf-good' : 'text-red-500'
      }`}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="currentColor"
        className={isUp ? '' : 'rotate-180'}
      >
        <path d="M5 1L9 7H1L5 1Z" />
      </svg>
      {Math.abs(trend).toFixed(1)}
    </span>
  );
}

export default function SuperpowersGrid({ superpowers }: SuperpowersGridProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-sf-dark mb-4">Team Superpowers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {superpowers.map((sp) => (
          <div
            key={sp.area}
            className="bg-white rounded-xl p-4 shadow-card border-t-4 border-sf-good"
          >
            <p className="text-xs font-medium text-sf-secondary uppercase tracking-wide mb-2">
              {sp.areaLabel}
            </p>
            <p className="text-lg font-semibold text-sf-dark">{sp.sdrName.split(' ')[0]}</p>
            <div className="flex items-center gap-1.5">
              <p className="text-2xl font-bold text-sf-good">{sp.score.toFixed(1)}</p>
              <TrendIndicator trend={sp.trend} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
