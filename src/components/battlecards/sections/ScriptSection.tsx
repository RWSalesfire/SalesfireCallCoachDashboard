'use client';

import { useState } from 'react';
import type { ScriptSection as ScriptSectionData, VerbatimStage, GuidedStage } from '@/data/chimpToChampData';

interface Props {
  section: ScriptSectionData;
}

function VerbatimStageCard({
  stage,
  stageNum,
  isOpen,
  onToggle,
}: {
  stage: VerbatimStage;
  stageNum: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-sf-border shadow-card">
      {/* Clickable header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full bg-sf-dark text-white text-[10px] font-bold">
            {stageNum}
          </span>
          <h4 className="font-semibold text-sf-dark">{stage.title}</h4>
        </div>
        <svg
          className={`w-4 h-4 text-sf-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-xs text-sf-secondary italic ml-[30px]">{stage.instruction}</p>

          {/* Timeline */}
          <div className="relative pl-6 ml-[4px]">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-sf-border" />
            <div className="space-y-3">
              {stage.lines.map((line, i) => (
                <div key={i} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-sf-border ring-2 ring-white" />

                  <div
                    className={`bg-white rounded-xl border border-sf-border shadow-card p-4 border-l-2 ${
                      line.speaker === 'sdr' ? 'border-l-sf-dark' : 'border-l-sf-secondary'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sf-secondary">
                      {line.speaker === 'sdr' ? 'SDR' : 'Prospect'}
                    </span>
                    <p className="text-sm text-sf-body mt-1 leading-relaxed">{line.line}</p>
                    {line.note && (
                      <p className="text-xs text-sf-secondary italic mt-2">{line.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GuidedStageCard({
  stage,
  stageNum,
  isOpen,
  onToggle,
}: {
  stage: GuidedStage;
  stageNum: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-sf-border shadow-card">
      {/* Clickable header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full bg-sf-dark text-white text-[10px] font-bold">
            {stageNum}
          </span>
          <h4 className="font-semibold text-sf-dark">{stage.title}</h4>
        </div>
        <svg
          className={`w-4 h-4 text-sf-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-xs text-sf-secondary italic ml-[30px]">{stage.instruction}</p>

          {/* Bullet list card */}
          <div className="bg-white rounded-xl border border-sf-border shadow-card p-4 ml-[30px]">
            <ul className="space-y-2.5">
              {stage.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-sf-body leading-relaxed">
                  <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-sf-secondary" />
                  <span className="flex-1">{bullet.text}</span>
                  {bullet.questionRef && (
                    <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-sf-card text-sf-dark text-[10px] font-bold border border-sf-border">
                      Q{bullet.questionRef}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScriptSection({ section }: Props) {
  const [activeVariation, setActiveVariation] = useState(section.variations[0].id);
  const [expandedObjection, setExpandedObjection] = useState<string | null>(null);
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set([0]));

  const variation = section.variations.find((v) => v.id === activeVariation) ?? section.variations[0];

  const toggleStage = (index: number) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <p className="text-sm text-sf-secondary leading-relaxed">{section.intro}</p>

      {/* Variation toggle (hidden when only one variation) */}
      {section.variations.length > 1 && (
        <div className="flex gap-1">
          {section.variations.map((v) => {
            const isActive = v.id === activeVariation;
            return (
              <button
                key={v.id}
                onClick={() => {
                  setActiveVariation(v.id);
                  setExpandedObjection(null);
                  setExpandedStages(new Set([0]));
                }}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sf-dark text-white'
                    : 'text-sf-secondary hover:text-sf-dark hover:bg-sf-card'
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Variation description */}
      <p className="text-sm text-sf-secondary">{variation.description}</p>

      {/* Stages */}
      <div className="space-y-3">
        {variation.stages.map((stage, i) =>
          stage.format === 'verbatim' ? (
            <VerbatimStageCard
              key={stage.title}
              stage={stage}
              stageNum={i + 1}
              isOpen={expandedStages.has(i)}
              onToggle={() => toggleStage(i)}
            />
          ) : (
            <GuidedStageCard
              key={stage.title}
              stage={stage}
              stageNum={i + 1}
              isOpen={expandedStages.has(i)}
              onToggle={() => toggleStage(i)}
            />
          ),
        )}
      </div>

      {/* Objections */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sf-dark">Objection Handling</h4>
        {variation.objections.map((obj) => {
          const isOpen = expandedObjection === obj.trigger;
          return (
            <div
              key={obj.trigger}
              className="bg-white rounded-xl border border-sf-border shadow-card"
            >
              <button
                onClick={() => setExpandedObjection(isOpen ? null : obj.trigger)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-semibold text-sf-dark text-sm">&ldquo;{obj.trigger}&rdquo;</span>
                <svg
                  className={`w-4 h-4 text-sf-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sf-secondary">Response</span>
                    <p className="text-sm text-sf-body mt-1 leading-relaxed">{obj.response}</p>
                  </div>
                  {obj.followUp && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sf-secondary">Follow-up</span>
                      <p className="text-sm text-sf-body mt-1 leading-relaxed">{obj.followUp}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
