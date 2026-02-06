'use client';

import { useState } from 'react';
import { ScoringArea } from '@/data/guideData';

interface ScoringAreaCardProps {
  area: ScoringArea;
  index: number;
}

function SubSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-sf-border/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-sm font-medium text-sf-secondary hover:text-sf-dark transition-colors"
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
}

const SCORE_COLORS = {
  good: { bg: 'bg-sf-good/20', border: 'border-sf-good', text: 'text-sf-dark' },
  focus: { bg: 'bg-sf-focus/30', border: 'border-sf-focus', text: 'text-sf-dark' },
  alert: { bg: 'bg-sf-alert/20', border: 'border-sf-alert', text: 'text-sf-alert' },
};

export default function ScoringAreaCard({ area, index }: ScoringAreaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden border-l-4 border-sf-dark">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-sf-card/30 transition-colors"
      >
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-sf-secondary">{index + 1}.</span>
            <h3 className="text-lg font-semibold text-sf-dark">{area.title}</h3>
          </div>
          <p className="text-sm text-sf-secondary mt-0.5">{area.description}</p>
        </div>
        <svg
          className={`w-5 h-5 text-sf-secondary flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-1">
          {/* Score Bands - always visible */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
            {area.scoreBands.map((band) => {
              const colors = SCORE_COLORS[band.color];
              return (
                <div
                  key={band.range}
                  className={`${colors.bg} border-l-2 ${colors.border} rounded-lg px-3 py-2`}
                >
                  <div className={`text-xs font-semibold ${colors.text}`}>
                    {band.label} ({band.range})
                  </div>
                  <p className="text-xs text-sf-body mt-0.5">{band.description}</p>
                </div>
              );
            })}
          </div>

          {/* What Good Looks Like */}
          <SubSection title="What Good Looks Like" defaultOpen>
            <ul className="space-y-1.5">
              {area.whatGoodLooksLike.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-sf-body">
                  <span className="text-sf-good font-bold mt-0.5 flex-shrink-0">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </SubSection>

          {/* Scripts & Phrases */}
          <SubSection title="Scripts &amp; Phrases">
            <div className="space-y-2">
              {area.scriptsAndPhrases.map((sp, i) => (
                <div key={i} className="bg-sf-card rounded-lg p-3">
                  {sp.context && (
                    <p className="text-xs font-medium text-sf-secondary mb-1">{sp.context}</p>
                  )}
                  <p className="text-sm text-sf-body italic">&ldquo;{sp.script}&rdquo;</p>
                </div>
              ))}
            </div>
          </SubSection>

          {/* Common Mistakes */}
          <SubSection title="Common Mistakes">
            <ul className="space-y-1.5">
              {area.commonMistakes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-sf-body">
                  <span className="text-sf-alert font-bold mt-0.5 flex-shrink-0">&#9651;</span>
                  {item}
                </li>
              ))}
            </ul>
          </SubSection>

          {/* Real Examples */}
          <SubSection title="Real Examples">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {area.realExamples.map((ex, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-3 border-l-4 ${
                    ex.type === 'good'
                      ? 'bg-sf-good/10 border-sf-good'
                      : 'bg-sf-alert/10 border-sf-alert'
                  }`}
                >
                  <p className={`text-xs font-semibold mb-1 ${
                    ex.type === 'good' ? 'text-sf-dark' : 'text-sf-alert'
                  }`}>
                    {ex.type === 'good' ? 'Good' : 'Bad'}
                  </p>
                  <p className="text-sm text-sf-body">{ex.text}</p>
                </div>
              ))}
            </div>
          </SubSection>
        </div>
      )}
    </div>
  );
}
