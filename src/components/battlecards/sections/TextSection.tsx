'use client';

import { useState } from 'react';
import type { TextSection as TextSectionData } from '@/data/chimpToChampData';

interface Props {
  section: TextSectionData;
}

export default function TextSection({ section }: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-sf-card rounded-xl p-5 md:p-6">
        <h3 className="font-semibold text-sf-dark mb-2">{section.heading}</h3>
        <p className="text-sm text-sf-secondary leading-relaxed">
          {section.overview}
        </p>
      </div>

      {/* Technique cards */}
      <div className="space-y-3">
        {section.techniques.map((tech, i) => {
          const isOpen = expandedIdx === i;
          return (
            <div
              key={tech.title}
              className="bg-white rounded-xl border border-sf-border shadow-card"
            >
              <button
                onClick={() => setExpandedIdx(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <h4 className="font-semibold text-sf-dark">{tech.title}</h4>
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
                <div className="px-4 pb-4 space-y-2">
                  <p className="text-sm text-sf-secondary leading-relaxed">
                    {tech.description}
                  </p>
                  {tech.example && (
                    <div className="bg-sf-card rounded-lg p-3 text-sm text-sf-body italic">
                      {tech.example}
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
