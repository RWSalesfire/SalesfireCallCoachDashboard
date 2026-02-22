'use client';

import { Call } from '@/types';
import OutcomeBadge from '@/components/ui/OutcomeBadge';
import EmptyState from '@/components/ui/EmptyState';

interface WinOfTheWeekProps {
  calls: Call[];
}

export default function WinOfTheWeek({ calls }: WinOfTheWeekProps) {
  if (calls.length === 0) {
    return (
      <div>
        <h2 className="section-title mb-4">🏆 Win of the Week</h2>
        <EmptyState
          icon="⭐"
          title="No calls reviewed yet this week"
          description="Your first win is just around the corner. Make some calls and we’ll highlight your best one here."
        />
      </div>
    );
  }

  const bestCall = calls.reduce((best, call) =>
    call.overall > best.overall ? call : best
  , calls[0]);

  const getScoreBg = (score: number) => {
    if (score >= 7) return 'bg-sf-good/15 text-emerald-700';
    if (score >= 5) return 'bg-sf-focus/20 text-amber-700';
    return 'bg-sf-alert/15 text-red-700';
  };

  return (
    <div className="bg-sf-card rounded-xl p-5 border-l-4 border-sf-good">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🏆</span>
        <h2 className="card-title">Win of the Week</h2>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sf-dark font-medium text-sm">{bestCall.company}<span className="text-sf-secondary font-normal"> — {bestCall.prospect}</span></p>
          <div className="flex items-center gap-2 mt-1.5">
            <OutcomeBadge outcome={bestCall.outcome} />
          </div>
          {bestCall.insight && (
            <p className="text-sf-secondary text-sm mt-2 leading-relaxed">{bestCall.insight}</p>
          )}
        </div>

        <div className={`flex-shrink-0 rounded-xl px-4 py-3 text-center ${getScoreBg(bestCall.overall)}`}>
          <div className="text-2xl font-bold leading-none">
            {bestCall.overall.toFixed(1)}
          </div>
          <div className="text-[10px] uppercase tracking-wider mt-1 opacity-70">overall</div>
        </div>
      </div>
    </div>
  );
}
