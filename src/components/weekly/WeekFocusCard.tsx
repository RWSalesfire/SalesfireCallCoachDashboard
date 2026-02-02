'use client';

import { WeekFocus } from '@/types';

interface WeekFocusCardProps {
  focus: WeekFocus;
}

export default function WeekFocusCard({ focus }: WeekFocusCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-card border-l-4 border-sf-good">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">📍</span>
        <h3 className="text-lg font-semibold text-sf-dark">
          This Week&apos;s Focus: {focus.title}
        </h3>
      </div>

      {/* Triggers */}
      <div className="mb-4">
        <p className="text-sm text-sf-secondary mb-2">When they say it:</p>
        <div className="flex flex-wrap gap-2">
          {focus.triggers.map((trigger, idx) => (
            <span
              key={idx}
              className="bg-sf-card rounded-full px-3 py-1 text-sm text-sf-body"
            >
              &ldquo;{trigger}&rdquo;
            </span>
          ))}
        </div>
      </div>

      {/* Do/Don't */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2">
          <span className="text-sf-alert text-lg">❌</span>
          <div>
            <span className="text-sm font-medium text-sf-secondary">Don&apos;t: </span>
            <span className="text-sm text-sf-body">{focus.dont}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-sf-good text-lg">✅</span>
          <div>
            <span className="text-sm font-medium text-sf-secondary">Do: </span>
            <span className="text-sm text-sf-body">{focus.do}</span>
          </div>
        </div>
      </div>

      {/* Example from this week */}
      <div className="bg-sf-card rounded-lg p-4">
        <p className="text-sm font-medium text-sf-secondary mb-2">From this week:</p>
        <p className="text-sm text-sf-body mb-2">{focus.example.context}</p>
        <p className="text-sm text-sf-body">
          <span className="font-medium">Could have said: </span>
          &ldquo;{focus.example.couldHaveSaid}&rdquo;
        </p>
      </div>
    </div>
  );
}
