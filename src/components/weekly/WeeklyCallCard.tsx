'use client';

import { useState } from 'react';
import { Call } from '@/types';
import ScoreBadge from '@/components/ui/ScoreBadge';
import OutcomeBadge from '@/components/ui/OutcomeBadge';
import MetricsRow from './MetricsRow';
import AreaBreakdownSection from './AreaBreakdownSection';

interface WeeklyCallCardProps {
  call: Call;
}

function ScoreGrid({ scores }: { scores: NonNullable<Call['scores']> }) {
  const scoreItems = [
    { label: 'Gate', value: scores.gatekeeper },
    { label: 'Open', value: scores.opener },
    { label: 'Pers', value: scores.personalisation },
    { label: 'Disc', value: scores.discovery },
    { label: 'Ctrl', value: scores.callControl },
    { label: 'Tone', value: scores.toneEnergy },
    { label: 'VP', value: scores.valueProp },
    { label: 'Obj', value: scores.objections },
    { label: 'Close', value: scores.close },
  ];

  const getScoreBg = (score: number | 'N/A') => {
    if (score === 'N/A') return 'bg-gray-100';
    if (score >= 7) return 'bg-sf-good/20';
    if (score >= 5) return 'bg-sf-focus/30';
    return 'bg-sf-alert/20';
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
      {scoreItems.map((item) => (
        <div key={item.label} className="text-center">
          <div className="text-xs text-sf-secondary mb-1">{item.label}</div>
          <div className={`rounded-lg py-2 ${getScoreBg(item.value)}`}>
            <span className="text-sm font-medium text-sf-body">
              {item.value === 'N/A' ? 'N/A' : item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WeeklyCallCard({ call }: WeeklyCallCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.toLocaleDateString('en-GB', { weekday: 'short' });
    const dayNum = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'short' });
    return `${day} ${dayNum} ${month}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden border border-sf-border/50">
      {/* Collapsed header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start justify-between gap-4 hover:bg-sf-card/30 transition-colors"
      >
        <div className="flex-1 min-w-0 text-left">
          <h3 className="font-semibold text-sf-body truncate">{call.company}</h3>
          <p className="text-sm text-sf-secondary mt-0.5">
            {call.prospect} • {formatDate(call.date)} • {call.duration}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ScoreBadge score={call.overall} />
          <OutcomeBadge outcome={call.outcome} />
          <svg
            className={`w-5 h-5 text-sf-secondary transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && call.scores && (
        <div className="px-4 pb-4 pt-2 border-t border-sf-border/50 space-y-4">
          {/* Call Metrics */}
          {call.metrics && (
            <div>
              <h4 className="text-sm font-medium text-sf-secondary mb-2">Call Metrics</h4>
              <MetricsRow metrics={call.metrics} />
            </div>
          )}

          {/* Score grid */}
          <div>
            <h4 className="text-sm font-medium text-sf-secondary mb-2">Scores</h4>
            <ScoreGrid scores={call.scores} />
          </div>

          {/* Area Breakdowns */}
          {call.areaBreakdown && Object.keys(call.areaBreakdown).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-sf-secondary mb-2">Area Breakdowns</h4>
              <AreaBreakdownSection breakdown={call.areaBreakdown} />
            </div>
          )}

          {/* Key Moment */}
          {call.keyMoment && (
            <div>
              <h4 className="text-sm font-medium text-sf-secondary mb-1">Key Moment</h4>
              <p className="text-sf-body text-sm leading-relaxed">
                &ldquo;{call.keyMoment}&rdquo;
              </p>
            </div>
          )}

          {/* Try Next Time */}
          {call.improvement && (
            <div className="bg-sf-card rounded-lg p-3">
              <h4 className="text-sm font-medium text-sf-dark mb-1">Try Next Time</h4>
              <p className="text-sf-body text-sm leading-relaxed">
                {call.improvement}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
