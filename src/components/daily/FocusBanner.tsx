'use client';

import { FocusToday } from '@/types';

interface FocusBannerProps {
  focus: FocusToday;
}

export default function FocusBanner({ focus }: FocusBannerProps) {
  return (
    <div className="bg-sf-card rounded-xl p-6 border-l-4 border-sf-good">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🎯</span>
        <div>
          <h3 className="font-semibold text-sf-dark mb-2">Focus Today</h3>
          <p className="text-sf-body text-base leading-relaxed">
            {focus.instruction}
          </p>
        </div>
      </div>
    </div>
  );
}
