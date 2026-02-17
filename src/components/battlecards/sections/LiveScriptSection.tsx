'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type {
  LiveScriptSection as LiveScriptSectionData,
  LiveScriptLine,
  BranchPhaseContent,
  FrustrationBranch,
  NoneResonateBranch,
  BranchClose,
  ToolboxQuestion,
} from '@/data/chimpToChampData';
import { getToolboxQuestionTitle, getToolboxQuestionText } from '@/data/chimpToChampData';

interface Props {
  section: LiveScriptSectionData;
}

// ─── Opener Card ──────────────────────────────────────────────────────────────

function OpenerCard({
  lines,
  frustrations,
  transitionPrompt,
  compact,
  onToggle,
}: {
  lines: LiveScriptLine[];
  frustrations: FrustrationBranch[];
  transitionPrompt: string;
  compact: boolean;
  onToggle: () => void;
}) {
  if (compact) {
    return (
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between bg-sf-dark text-white rounded-xl px-5 py-3 text-left"
      >
        <span className="font-semibold text-sm">Opener</span>
        <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    );
  }

  return (
    <div className="bg-sf-dark rounded-xl p-5 md:p-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-lg">Opener</h3>
        <button
          onClick={onToggle}
          className="text-white/60 hover:text-white/90 text-xs font-medium transition-colors"
        >
          Collapse
        </button>
      </div>

      {/* Moment 1: Greeting & Permission */}
      <div className="space-y-3">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-3">
            <span
              className={`shrink-0 text-[10px] font-bold uppercase tracking-wider mt-1 w-16 ${
                line.speaker === 'sdr' ? 'text-sf-good' : 'text-white/40'
              }`}
            >
              {line.speaker === 'sdr' ? 'SDR' : 'Prospect'}
            </span>
            <p
              className={`leading-relaxed ${
                line.speaker === 'sdr'
                  ? 'text-white/90 text-base'
                  : 'text-white/50 text-base italic'
              }`}
            >
              {line.text}
              {line.note && (
                <span className="block text-white/40 text-xs italic mt-1">{line.note}</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Moment 2: The Four Frustrations — large tiles */}
      <div className="space-y-3">
        {frustrations.map((f, i) => (
          <div
            key={f.id}
            className="bg-white/10 border border-white/15 rounded-xl p-5"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-base">{f.icon}</span>
              <span className="text-sm text-white/60 font-medium">{f.label}</span>
            </div>
            <p className="text-lg text-white leading-relaxed font-medium">
              &ldquo;{f.openerScript}&rdquo;
            </p>
          </div>
        ))}
      </div>

      {/* Moment 3: Transition */}
      <div className="border-t border-white/20 pt-4">
        <p className="text-sf-good font-semibold text-base md:text-lg">
          {transitionPrompt}
        </p>
        <p className="text-white/40 text-xs mt-1">Click a frustration below when the prospect responds</p>
      </div>
    </div>
  );
}

// ─── Frustration Cards ────────────────────────────────────────────────────────

function FrustrationCard({
  branch,
  isActive,
  isCompleted,
  isDimmed,
  compact,
  onClick,
}: {
  branch: FrustrationBranch;
  isActive: boolean;
  isCompleted: boolean;
  isDimmed: boolean;
  compact: boolean;
  onClick: () => void;
}) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          isActive
            ? 'bg-sf-dark text-white'
            : isCompleted
              ? 'bg-white border border-sf-good text-sf-dark'
              : 'bg-white border border-sf-border text-sf-secondary hover:border-sf-dark hover:text-sf-dark'
        }`}
      >
        <span>{branch.icon}</span>
        <span>{branch.label}</span>
        {isCompleted && !isActive && (
          <svg className="w-3 h-3 text-sf-good" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border p-4 transition-all w-full ${
        isActive
          ? 'bg-sf-card border-sf-dark shadow-card'
          : isCompleted
            ? 'bg-white border-sf-good shadow-card'
            : isDimmed
              ? 'bg-white border-sf-border opacity-70'
              : 'bg-white border-sf-border shadow-card hover:border-sf-dark'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{branch.icon}</span>
          <div>
            <h4 className="font-semibold text-sf-dark text-sm">{branch.label}</h4>
            <p className="text-xs text-sf-secondary mt-0.5">{branch.subtitle}</p>
          </div>
        </div>
        {isActive && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-sf-dark bg-sf-good/30 px-2 py-0.5 rounded-full">
            Active
          </span>
        )}
        {isCompleted && !isActive && (
          <svg className="w-5 h-5 text-sf-good" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
    </button>
  );
}

function NoneResonateCard({
  branch,
  isActive,
  isDimmed,
  compact,
  onClick,
}: {
  branch: NoneResonateBranch;
  isActive: boolean;
  isDimmed: boolean;
  compact: boolean;
  onClick: () => void;
}) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border-dashed ${
          isActive
            ? 'bg-sf-card-alt border border-sf-dark text-sf-dark'
            : 'bg-sf-card-alt border border-sf-border text-sf-secondary hover:border-sf-dark hover:text-sf-dark'
        }`}
      >
        <span>❓</span>
        <span>None</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border-2 border-dashed p-4 transition-all w-full ${
        isActive
          ? 'bg-sf-card-alt border-sf-dark'
          : isDimmed
            ? 'bg-sf-card-alt border-sf-border opacity-70'
            : 'bg-sf-card-alt border-sf-border hover:border-sf-dark'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">❓</span>
        <div>
          <h4 className="font-semibold text-sf-dark text-sm">{branch.label}</h4>
          <p className="text-xs text-sf-secondary mt-0.5">{branch.subtitle}</p>
        </div>
        {isActive && (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-sf-dark bg-sf-good/30 px-2 py-0.5 rounded-full">
            Active
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Frustration Selector ─────────────────────────────────────────────────────

function FrustrationSelector({
  frustrations,
  noneResonate,
  activeBranch,
  completedBranches,
  compact,
  onSelect,
  onSelectNone,
}: {
  frustrations: FrustrationBranch[];
  noneResonate: NoneResonateBranch;
  activeBranch: string | null;
  completedBranches: Set<string>;
  compact: boolean;
  onSelect: (id: string) => void;
  onSelectNone: () => void;
}) {
  if (compact) {
    return (
      <div className="sticky top-[52px] z-10 bg-white/95 backdrop-blur py-2 -mx-1 px-1">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
          {frustrations.map((f) => (
            <FrustrationCard
              key={f.id}
              branch={f}
              isActive={activeBranch === f.id}
              isCompleted={completedBranches.has(f.id)}
              isDimmed={false}
              compact
              onClick={() => onSelect(f.id)}
            />
          ))}
          <NoneResonateCard
            branch={noneResonate}
            isActive={activeBranch === 'none-resonate'}
            isDimmed={false}
            compact
            onClick={onSelectNone}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {frustrations.map((f) => (
          <FrustrationCard
            key={f.id}
            branch={f}
            isActive={activeBranch === f.id}
            isCompleted={completedBranches.has(f.id)}
            isDimmed={activeBranch !== null && activeBranch !== f.id}
            compact={false}
            onClick={() => onSelect(f.id)}
          />
        ))}
      </div>
      <NoneResonateCard
        branch={noneResonate}
        isActive={activeBranch === 'none-resonate'}
        isDimmed={activeBranch !== null && activeBranch !== 'none-resonate'}
        compact={false}
        onClick={onSelectNone}
      />
    </div>
  );
}

// ─── Phase Renderers ──────────────────────────────────────────────────────────

function DialoguePhase({ phase }: { phase: BranchPhaseContent }) {
  return (
    <div className="space-y-3">
      {phase.instruction && (
        <p className="text-xs text-sf-secondary italic">{phase.instruction}</p>
      )}
      <div className="space-y-3">
        {phase.lines?.map((line, i) => (
          <div
            key={i}
            className={`rounded-xl border border-sf-border p-4 border-l-[3px] ${
              line.speaker === 'sdr' ? 'border-l-sf-dark bg-white' : 'border-l-sf-secondary bg-sf-card/50'
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                line.speaker === 'sdr' ? 'text-sf-dark' : 'text-sf-secondary'
              }`}
            >
              {line.speaker === 'sdr' ? 'SDR' : 'Prospect'}
            </span>
            <p className="text-base text-sf-body mt-1 leading-relaxed">{line.text}</p>
            {line.note && (
              <p className="text-xs text-sf-secondary italic mt-2">{line.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NarrativePhase({ phase }: { phase: BranchPhaseContent }) {
  return (
    <div className="space-y-3">
      {phase.instruction && (
        <p className="text-xs text-sf-secondary italic">{phase.instruction}</p>
      )}
      <div className="relative pl-6">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-sf-border" />
        <div className="space-y-3">
          {phase.lines?.map((line, i) => (
            <div key={i} className="relative">
              <div
                className={`absolute -left-6 top-3 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                  line.speaker === 'sdr' ? 'bg-sf-dark' : 'bg-sf-secondary'
                }`}
              />
              <div
                className={`rounded-xl border border-sf-border p-4 border-l-[3px] ${
                  line.speaker === 'sdr' ? 'border-l-sf-dark bg-white' : 'border-l-sf-secondary bg-sf-card/50'
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    line.speaker === 'sdr' ? 'text-sf-dark' : 'text-sf-secondary'
                  }`}
                >
                  {line.speaker === 'sdr' ? 'SDR' : 'Prospect'}
                </span>
                <p className="text-base text-sf-body mt-1 leading-relaxed">{line.text}</p>
                {line.note && (
                  <p className="text-xs text-sf-secondary italic mt-2">{line.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToolboxPhase({ phase }: { phase: BranchPhaseContent }) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleQuestionExpanded = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {phase.instruction && (
        <p className="text-xs text-sf-secondary italic">{phase.instruction}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {phase.questions?.map((q) => {
          const title = getToolboxQuestionTitle(q);
          const text = getToolboxQuestionText(q);
          const isExpanded = expandedQuestions.has(q.id);

          return (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-sf-border shadow-card hover:border-sf-dark transition-colors"
            >
              {title ? (
                <div className="p-4">
                  <button
                    onClick={() => toggleQuestionExpanded(q.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🔄</span>
                      <span className="font-medium text-sf-focus text-sm">{title}</span>
                    </div>
                    <svg
                      className={`w-3 h-3 transition-transform text-sf-secondary ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isExpanded && (
                    <div className="mt-2 pt-2 border-t border-sf-border">
                      <p className="text-base text-sf-body leading-relaxed">{text}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-base text-sf-body leading-relaxed">{text}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PhaseRenderer({ phase }: { phase: BranchPhaseContent }) {
  switch (phase.type) {
    case 'narrative':
      return <NarrativePhase phase={phase} />;
    case 'toolbox':
      return <ToolboxPhase phase={phase} />;
    case 'dialogue':
    default:
      return <DialoguePhase phase={phase} />;
  }
}

// ─── Loop Back Prompt ─────────────────────────────────────────────────────────

function LoopBackPrompt({ text }: { text: string }) {
  return (
    <div className="bg-sf-card rounded-xl border border-sf-border p-5">
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">🔄</span>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sf-dark">Loop Back</span>
          <p className="text-base text-sf-body mt-1 leading-relaxed font-medium">{text}</p>
          <p className="text-xs text-sf-secondary mt-2">Click another frustration above, or go to Social Proof &amp; Close</p>
        </div>
      </div>
    </div>
  );
}

// ─── Branch Close Panel ───────────────────────────────────────────────────────

function BranchClosePanel({
  close,
  visible,
  onShow,
}: {
  close: BranchClose;
  visible: boolean;
  onShow: () => void;
}) {
  if (!visible) {
    return (
      <button
        onClick={onShow}
        className="w-full flex items-center justify-center gap-2 bg-sf-good text-sf-dark font-semibold py-3 px-6 rounded-xl hover:bg-sf-good/80 transition-colors text-base"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Social Proof &amp; Close
      </button>
    );
  }

  return (
    <div className="animate-slide-down space-y-3">
      <h4 className="font-bold text-sf-dark flex items-center gap-2">
        <svg className="w-5 h-5 text-sf-good" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Social Proof &amp; Close
      </h4>
      <div className="space-y-3">
        {close.lines.map((line, i) => (
          <div
            key={i}
            className={`rounded-xl border border-sf-border p-4 border-l-[3px] ${
              line.speaker === 'sdr' ? 'border-l-sf-good bg-white' : 'border-l-sf-secondary bg-sf-card/50'
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                line.speaker === 'sdr' ? 'text-sf-dark' : 'text-sf-secondary'
              }`}
            >
              {line.speaker === 'sdr' ? 'SDR' : 'Prospect'}
            </span>
            <p className="text-base text-sf-body mt-1 leading-relaxed">{line.text}</p>
            {line.note && (
              <p className="text-xs text-sf-secondary italic mt-2">{line.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Branch Panel ─────────────────────────────────────────────────────────────

function BranchPanel({
  branch,
  showClose,
  onShowClose,
}: {
  branch: FrustrationBranch;
  showClose: boolean;
  onShowClose: () => void;
}) {
  return (
    <div className="animate-slide-down space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-sf-border">
        <span className="text-xl">{branch.icon}</span>
        <h3 className="font-bold text-sf-dark text-lg">{branch.label}</h3>
      </div>

      {branch.phases.map((phase) => (
        <div key={phase.id} className="space-y-2">
          <h4 className="font-semibold text-sf-dark">{phase.title}</h4>
          <PhaseRenderer phase={phase} />
        </div>
      ))}

      <LoopBackPrompt text={branch.loopBack} />

      <BranchClosePanel close={branch.close} visible={showClose} onShow={onShowClose} />
    </div>
  );
}

function NoneResonateBranchPanel({
  branch,
  showClose,
  onShowClose,
}: {
  branch: NoneResonateBranch;
  showClose: boolean;
  onShowClose: () => void;
}) {
  return (
    <div className="animate-slide-down space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-sf-border">
        <span className="text-xl">❓</span>
        <h3 className="font-bold text-sf-dark text-lg">{branch.label}</h3>
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full ml-auto">
          Placeholder
        </span>
      </div>

      {branch.phases.map((phase) => (
        <div key={phase.id} className="space-y-2">
          <h4 className="font-semibold text-sf-dark">{phase.title}</h4>
          <PhaseRenderer phase={phase} />
        </div>
      ))}

      <BranchClosePanel close={branch.close} visible={showClose} onShow={onShowClose} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LiveScriptSection({ section }: Props) {
  const [activeBranch, setActiveBranch] = useState<string | null>(null);
  const [completedBranches, setCompletedBranches] = useState<Set<string>>(new Set());
  const [showClose, setShowClose] = useState<Record<string, boolean>>({});
  const [openerCompact, setOpenerCompact] = useState(false);

  const branchRef = useRef<HTMLDivElement>(null);
  const hasSelectedAny = activeBranch !== null || completedBranches.size > 0;

  const scrollToBranch = useCallback(() => {
    // Small delay to let the DOM render
    setTimeout(() => {
      branchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handleSelectFrustration = useCallback(
    (id: string) => {
      if (activeBranch && activeBranch !== id) {
        setCompletedBranches((prev) => new Set(prev).add(activeBranch));
      }
      setActiveBranch(id);
      setOpenerCompact(true);
      scrollToBranch();
    },
    [activeBranch, scrollToBranch],
  );

  const handleSelectNone = useCallback(() => {
    if (activeBranch && activeBranch !== 'none-resonate') {
      setCompletedBranches((prev) => new Set(prev).add(activeBranch));
    }
    setActiveBranch('none-resonate');
    setOpenerCompact(true);
    scrollToBranch();
  }, [activeBranch, scrollToBranch]);

  const handleShowClose = useCallback((branchId: string) => {
    setShowClose((prev) => ({ ...prev, [branchId]: true }));
  }, []);

  const activeFrustration = section.frustrations.find((f) => f.id === activeBranch);

  return (
    <div className="space-y-4">
      {/* Opener */}
      <OpenerCard
        lines={section.opener.lines}
        frustrations={section.frustrations}
        transitionPrompt={section.opener.transitionPrompt}
        compact={openerCompact}
        onToggle={() => setOpenerCompact(!openerCompact)}
      />

      {/* Frustration selector */}
      <FrustrationSelector
        frustrations={section.frustrations}
        noneResonate={section.noneResonate}
        activeBranch={activeBranch}
        completedBranches={completedBranches}
        compact={hasSelectedAny}
        onSelect={handleSelectFrustration}
        onSelectNone={handleSelectNone}
      />

      {/* Branch content */}
      <div ref={branchRef}>
        {activeFrustration && (
          <BranchPanel
            key={activeFrustration.id}
            branch={activeFrustration}
            showClose={!!showClose[activeFrustration.id]}
            onShowClose={() => handleShowClose(activeFrustration.id)}
          />
        )}
        {activeBranch === 'none-resonate' && (
          <NoneResonateBranchPanel
            branch={section.noneResonate}
            showClose={!!showClose['none-resonate']}
            onShowClose={() => handleShowClose('none-resonate')}
          />
        )}
      </div>
    </div>
  );
}
