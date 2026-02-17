'use client';

import { useState } from 'react';
import type { QuestionsSection as QuestionsSectionData } from '@/data/chimpToChampData';
import { getFollowUpTitle, getFollowUpQuestion } from '@/data/chimpToChampData';

interface Props {
  section: QuestionsSectionData;
}

export default function QuestionsSection({ section }: Props) {
  const [focusMode, setFocusMode] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [expandedFollowUps, setExpandedFollowUps] = useState<Set<number>>(new Set());

  const toggleExpanded = (num: number) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const toggleFollowUpExpanded = (num: number) => {
    setExpandedFollowUps((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const coreQuestions = section.questions.filter((q) => !q.isBonus);
  const bonusQuestions = section.questions.filter((q) => q.isBonus);

  return (
    <div className="space-y-4">
      {/* Header row with focus toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-sf-secondary">{section.intro}</p>
        <button
          onClick={() => setFocusMode((v) => !v)}
          className={`ml-4 shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            focusMode
              ? 'bg-sf-dark text-white border-sf-dark'
              : 'bg-white text-sf-dark border-sf-border hover:border-sf-dark/30'
          }`}
        >
          {focusMode ? 'Exit Focus' : 'Focus Mode'}
        </button>
      </div>

      {/* Core questions */}
      <div className="space-y-3">
        {coreQuestions.map((q) => (
          <QuestionCard
            key={q.number}
            q={q}
            focusMode={focusMode}
            expanded={expandedCards.has(q.number)}
            onToggle={() => toggleExpanded(q.number)}
            followUpExpanded={expandedFollowUps.has(q.number)}
            onToggleFollowUp={() => toggleFollowUpExpanded(q.number)}
          />
        ))}
      </div>

      {/* Bonus questions */}
      {!focusMode && (
        <div className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-sf-secondary mb-3">
            Bonus Questions
          </p>
        </div>
      )}
      <div className="space-y-3">
        {bonusQuestions.map((q) => (
          <QuestionCard
            key={q.number}
            q={q}
            focusMode={focusMode}
            expanded={expandedCards.has(q.number)}
            onToggle={() => toggleExpanded(q.number)}
            followUpExpanded={expandedFollowUps.has(q.number)}
            onToggleFollowUp={() => toggleFollowUpExpanded(q.number)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Individual question card ─────────────────────────────────────────────────

import type { Question } from '@/data/chimpToChampData';

function QuestionCard({
  q,
  focusMode,
  expanded,
  onToggle,
  followUpExpanded,
  onToggleFollowUp,
}: {
  q: Question;
  focusMode: boolean;
  expanded: boolean;
  onToggle: () => void;
  followUpExpanded: boolean;
  onToggleFollowUp: () => void;
}) {
  const bgClass = q.isBonus ? 'bg-sf-card-alt' : 'bg-white';

  return (
    <div
      className={`rounded-xl border border-sf-border ${bgClass} shadow-card transition-all`}
    >
      {/* Main question row */}
      <div className="flex items-start gap-3 p-4">
        {/* Number badge */}
        <span
          className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
            q.isBonus
              ? 'bg-amber-100 text-amber-700'
              : 'bg-sf-dark text-white'
          }`}
        >
          {q.number}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <p className="text-base font-medium text-sf-body leading-snug">
              {q.question}
            </p>
            {q.isBonus && !focusMode && (
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                Bonus
              </span>
            )}
          </div>

          {/* Follow-up with title (not hidden in focus mode — SDRs need it mid-call) */}
          {q.followUp && !focusMode && (
            <div className="mt-2">
              {getFollowUpTitle(q.followUp) ? (
                <div className="space-y-1">
                  <button
                    onClick={onToggleFollowUp}
                    className="flex items-center gap-2 text-sm font-medium text-sf-focus hover:text-sf-dark transition-colors"
                  >
                    <span className="text-xs">🔄</span>
                    <span>{getFollowUpTitle(q.followUp)}</span>
                    <svg
                      className={`w-3 h-3 transition-transform ${followUpExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {followUpExpanded && (
                    <p className="text-sm text-sf-secondary italic pl-5">
                      &ldquo;{getFollowUpQuestion(q.followUp)}&rdquo;
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-sf-secondary italic">
                  Follow-up: &ldquo;{getFollowUpQuestion(q.followUp)}&rdquo;
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expandable details — hidden in focus mode */}
      {!focusMode && (q.whyItWorks || q.whenToUse) && (
        <div className="border-t border-sf-border">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-sf-secondary hover:text-sf-dark transition-colors"
          >
            <span>{q.whyItWorks ? 'Why it works' : 'When to use'}</span>
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expanded && (
            <div className="px-4 pb-4 text-sm text-sf-secondary leading-relaxed">
              {q.whyItWorks || q.whenToUse}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
