'use client';

import { FocusPriority } from '@/types';

interface FocusPriorityCardsProps {
  priorities: FocusPriority[];
}

const RANK_STYLES = {
  1: {
    border: 'border-sf-alert',
    bg: 'bg-sf-alert/10',
    icon: '1',
    iconBg: 'bg-sf-alert/20 text-sf-alert',
  },
  2: {
    border: 'border-sf-focus',
    bg: 'bg-sf-focus/10',
    icon: '2',
    iconBg: 'bg-sf-focus/20 text-sf-focus',
  },
  3: {
    border: 'border-sf-good',
    bg: 'bg-sf-good/10',
    icon: '3',
    iconBg: 'bg-sf-good/20 text-sf-good',
  },
};

export default function FocusPriorityCards({ priorities }: FocusPriorityCardsProps) {
  if (priorities.length === 0) return null;

  return (
    <div>
      <h2 className="section-title mb-5">3 Things to Focus On</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {priorities.map((p) => {
          const styles = RANK_STYLES[p.rank];
          return (
            <div
              key={p.area}
              className={`rounded-xl p-4 shadow-card-soft border-l-4 ${styles.border} ${styles.bg}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${styles.iconBg}`}
                  aria-hidden
                >
                  {styles.icon}
                </span>
                <span className="text-sm font-semibold text-sf-dark">{p.areaLabel}</span>
              </div>
              <p className="text-sm font-medium text-sf-secondary mb-1">Avg {p.avgScore.toFixed(1)}</p>
              <p className="text-sm text-sf-body leading-relaxed">{p.tryNext}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
