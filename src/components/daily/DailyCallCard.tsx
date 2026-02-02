'use client';

import { Call } from '@/types';
import ScoreBadge from '@/components/ui/ScoreBadge';
import OutcomeBadge from '@/components/ui/OutcomeBadge';

interface DailyCallCardProps {
  call: Call;
}

export default function DailyCallCard({ call }: DailyCallCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-card hover:shadow-card-hover transition-shadow duration-200 border border-sf-border/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sf-body truncate">{call.company}</h3>
          <p className="text-sm text-sf-secondary mt-1 line-clamp-1">{call.insight}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ScoreBadge score={call.overall} />
          <OutcomeBadge outcome={call.outcome} />
        </div>
      </div>
    </div>
  );
}
