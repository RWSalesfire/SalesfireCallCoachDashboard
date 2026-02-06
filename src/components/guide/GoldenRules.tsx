'use client';

import { GoldenRule } from '@/data/guideData';

interface GoldenRulesProps {
  rules: GoldenRule[];
}

export default function GoldenRules({ rules }: GoldenRulesProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-sf-dark mb-4">The Golden Rules</h2>
      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.number}
            className="bg-sf-dark text-white rounded-xl p-5 flex items-start gap-4"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
              {rule.number}
            </div>
            <div>
              <h3 className="font-semibold text-base">{rule.title}</h3>
              <p className="text-sm text-white/70 mt-1">{rule.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
