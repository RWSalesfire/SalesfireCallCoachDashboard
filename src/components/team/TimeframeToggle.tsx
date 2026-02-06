'use client';

import { Timeframe } from '@/types';

interface TimeframeToggleProps {
  currentTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
}

const OPTIONS: { value: Timeframe; label: string }[] = [
  { value: 'thisWeek', label: 'This Week' },
  { value: 'last4Weeks', label: '4 Weeks' },
  { value: 'last3Months', label: '3 Months' },
];

export default function TimeframeToggle({ currentTimeframe, onTimeframeChange }: TimeframeToggleProps) {
  return (
    <div className="inline-flex rounded-lg bg-sf-card p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onTimeframeChange(opt.value)}
          className={`
            px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200
            ${currentTimeframe === opt.value
              ? 'bg-sf-dark text-white shadow-sm'
              : 'text-sf-body hover:bg-white/50'}
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
