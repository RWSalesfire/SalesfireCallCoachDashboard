'use client';

import { TeamSuperpower } from '@/lib/teamData';

interface SuperpowersGridProps {
  superpowers: TeamSuperpower[];
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
            <p className="text-2xl font-bold text-sf-good">{sp.score.toFixed(1)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
