'use client';

import { FocusPriority } from '@/types';

interface FocusPriorityCardsProps {
  priorities: FocusPriority[];
}

const RANK_STYLES = {
  1: { border: 'border-sf-alert', bg: 'bg-sf-alert/10' },
  2: { border: 'border-sf-focus', bg: 'bg-sf-focus/10' },
  3: { border: 'border-sf-good', bg: 'bg-sf-good/10' },
};

export default function FocusPriorityCards({ priorities }: FocusPriorityCardsProps) {
  if (priorities.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-sf-dark mb-4">3 Things to Focus On</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {priorities.map((p) => {
          const styles = RANK_STYLES[p.rank];
          return (
            <div
              key={p.area}
              className={`rounded-xl p-4 shadow-card border-l-4 ${styles.border} ${styles.bg}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-sf-dark">{p.areaLabel}</span>
                <span className="text-sm font-medium text-sf-secondary">Avg {p.avgScore.toFixed(1)}</span>
              </div>
              <p className="text-sm text-sf-body leading-relaxed">{p.tryNext}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
