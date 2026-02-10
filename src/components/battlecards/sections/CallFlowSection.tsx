'use client';

import type { CallFlowSection as CallFlowSectionData } from '@/data/chimpToChampData';

interface Props {
  section: CallFlowSectionData;
}

export default function CallFlowSection({ section }: Props) {
  return (
    <div className="relative pl-6">
      {/* Vertical timeline line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-sf-border" />

      <div className="space-y-4">
        {section.steps.map((step) => (
          <div key={step.step} className="relative">
            {/* Step dot */}
            <div className="absolute -left-6 top-1 flex items-center justify-center w-[22px] h-[22px] rounded-full bg-sf-dark text-white text-[10px] font-bold ring-2 ring-white">
              {step.step}
            </div>

            <div className="bg-white rounded-xl border border-sf-border shadow-card p-4">
              <h4 className="font-semibold text-sf-dark text-sm">{step.label}</h4>
              <p className="text-sm text-sf-secondary mt-1 leading-relaxed">
                {step.description}
              </p>
              {step.questionRefs && step.questionRefs.length > 0 && (
                <div className="flex gap-1.5 mt-2">
                  {step.questionRefs.map((ref) => (
                    <span
                      key={ref}
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sf-card text-sf-dark text-[10px] font-bold border border-sf-border"
                    >
                      Q{ref}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
