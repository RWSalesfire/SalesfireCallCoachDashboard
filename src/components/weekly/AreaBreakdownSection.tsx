'use client';

import { useState } from 'react';
import { AreaBreakdownItem } from '@/types';

interface AreaBreakdownSectionProps {
  breakdown: Record<string, AreaBreakdownItem>;
}

const AREA_LABELS: Record<string, string> = {
  gatekeeper: 'Gatekeeper',
  opener: 'Opener',
  personalisation: 'Personalisation',
  discovery: 'Discovery',
  callControl: 'Call Control',
  toneEnergy: 'Tone & Energy',
  valueProp: 'Value Prop',
  objections: 'Objections',
  close: 'Close',
};

const AREA_ORDER = ['gatekeeper', 'opener', 'personalisation', 'discovery', 'callControl', 'toneEnergy', 'valueProp', 'objections', 'close'];

function getScoreBorderColor(score: number): string {
  if (score >= 7) return 'border-sf-good';
  if (score >= 5) return 'border-sf-focus';
  return 'border-sf-alert';
}

function getScoreBg(score: number): string {
  if (score >= 7) return 'bg-sf-good/20';
  if (score >= 5) return 'bg-sf-focus/30';
  return 'bg-sf-alert/20';
}

function AreaItem({ areaKey, item }: { areaKey: string; item: AreaBreakdownItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border-l-4 ${getScoreBorderColor(item.score)} rounded-lg bg-white`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-sf-body">
          {AREA_LABELS[areaKey] || areaKey}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold px-2 py-0.5 rounded ${getScoreBg(item.score)}`}>
            {item.score}/10
          </span>
          <svg
            className={`w-4 h-4 text-sf-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-sm text-sf-body leading-relaxed">{item.why}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-sf-good mb-1">✓ What went well</p>
              <p className="text-sm text-sf-body leading-relaxed">{item.well}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-sf-alert mb-1">△ Needs improvement</p>
              <p className="text-sm text-sf-body leading-relaxed">{item.improve}</p>
            </div>
          </div>

          <div className="bg-sf-card rounded-lg p-3">
            <p className="text-xs font-medium text-sf-dark mb-1">Try next time</p>
            <p className="text-sm text-sf-body leading-relaxed">{item.tryNext}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AreaBreakdownSection({ breakdown }: AreaBreakdownSectionProps) {
  const sortedAreas = AREA_ORDER.filter((key) => key in breakdown);

  return (
    <div className="space-y-2">
      {sortedAreas.map((key) => (
        <AreaItem key={key} areaKey={key} item={breakdown[key]} />
      ))}
    </div>
  );
}
