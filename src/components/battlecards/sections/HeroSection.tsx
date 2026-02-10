'use client';

import type { HeroSection as HeroSectionData } from '@/data/chimpToChampData';

interface Props {
  section: HeroSectionData;
}

export default function HeroSection({ section }: Props) {
  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="bg-sf-dark rounded-xl p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
          {section.headline}
        </h3>
        <p className="text-white/80 text-sm md:text-base leading-relaxed">
          {section.pitch}
        </p>
      </div>

      {/* Three pillars */}
      <div className="grid gap-4 sm:grid-cols-3">
        {section.pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="bg-white rounded-xl border border-sf-border p-5 shadow-card"
          >
            <h4 className="font-semibold text-sf-dark mb-2">{pillar.title}</h4>
            <p className="text-sm text-sf-secondary leading-relaxed">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
