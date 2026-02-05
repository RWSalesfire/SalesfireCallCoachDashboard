'use client';

import { CallMetrics } from '@/types';

interface MetricsRowProps {
  metrics: CallMetrics;
}

export default function MetricsRow({ metrics }: MetricsRowProps) {
  const items: { label: string; value: string; isGood: boolean }[] = [
    {
      label: 'Talk Time',
      value: `${metrics.talkTime}%`,
      isGood: metrics.talkTime < 60,
    },
    {
      label: 'Talk Speed',
      value: `${metrics.talkSpeed} wpm`,
      isGood: metrics.talkSpeed < 150,
    },
  ];

  if (metrics.monologue != null) {
    items.push({
      label: 'Monologue',
      value: `${metrics.monologue}s`,
      isGood: metrics.monologue < 45,
    });
  }

  if (metrics.customerStory != null) {
    items.push({
      label: 'Story',
      value: `${metrics.customerStory}s`,
      isGood: metrics.customerStory >= 30,
    });
  }

  if (metrics.patience != null) {
    items.push({
      label: 'Patience',
      value: `${metrics.patience >= 0 ? '+' : ''}${metrics.patience}s`,
      isGood: metrics.patience >= 0,
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-lg px-3 py-2 ${
            item.isGood ? 'bg-sf-good/20' : 'bg-sf-focus/30'
          }`}
        >
          <div className="text-xs text-sf-secondary">{item.label}</div>
          <div className="text-sm font-medium text-sf-body">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
