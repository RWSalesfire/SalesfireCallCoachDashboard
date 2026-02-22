'use client';

import { FocusToday } from '@/types';
import EmptyState from '@/components/ui/EmptyState';

const NO_FOCUS_MESSAGE = 'No focus instruction for today. Check back after calls are analyzed.';

interface FocusBannerProps {
  focus: FocusToday;
}

export default function FocusBanner({ focus }: FocusBannerProps) {
  const isEmpty = !focus.instruction || focus.instruction === NO_FOCUS_MESSAGE;

  if (isEmpty) {
    return (
      <div>
        <h2 className="section-title mb-4">🎯 Focus Today</h2>
        <EmptyState
          icon="🎯"
          title="No focus yet for today"
          description="Complete some calls and we’ll analyse them to suggest what to work on next."
        />
      </div>
    );
  }

  return (
    <div className="bg-sf-card rounded-xl p-6 border-l-4 border-sf-good shadow-card-soft">
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0" aria-hidden>🎯</span>
        <div>
          <h2 className="card-title mb-2">Focus Today</h2>
          <p className="text-sf-body text-base leading-relaxed">
            {focus.instruction}
          </p>
        </div>
      </div>
    </div>
  );
}
