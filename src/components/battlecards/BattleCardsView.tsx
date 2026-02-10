'use client';

import { useState } from 'react';
import { guideData } from '@/data/guideData';
import MetricsTable from '@/components/guide/MetricsTable';
import ScoringAreaCard from '@/components/guide/ScoringAreaCard';
import GoldenRules from '@/components/guide/GoldenRules';
import ChimpToChampView from './ChimpToChampView';
import KlaviyoAiConnectView from './KlaviyoAiConnectView';
import { chimpToChampData } from '@/data/chimpToChampData';
import { klaviyoAiConnectData } from '@/data/klaviyoAiConnectData';

type ActiveCard = 'good-call-bad-call' | 'chimp-to-champ' | 'klaviyo-ai-connect' | null;

const battleCards = [
  {
    id: 'good-call-bad-call' as const,
    title: 'Good Call vs Bad Call',
    description: 'What great calls look like across all 9 scoring areas',
  },
  {
    id: 'chimp-to-champ' as const,
    title: chimpToChampData.title,
    description: chimpToChampData.description,
  },
  {
    id: 'klaviyo-ai-connect' as const,
    title: klaviyoAiConnectData.title,
    description: klaviyoAiConnectData.description,
  },
];

export default function BattleCardsView() {
  const [activeCard, setActiveCard] = useState<ActiveCard>(null);

  if (activeCard === 'chimp-to-champ') {
    return (
      <div className="space-y-8">
        <button
          onClick={() => setActiveCard(null)}
          className="text-sm text-sf-dark hover:underline"
        >
          &larr; Back to Battle Cards
        </button>

        <div>
          <h2 className="text-2xl font-bold text-sf-dark">{chimpToChampData.title}</h2>
          <p className="text-sm text-sf-secondary mt-1">{chimpToChampData.description}</p>
        </div>

        <ChimpToChampView />
      </div>
    );
  }

  if (activeCard === 'klaviyo-ai-connect') {
    return (
      <div className="space-y-8">
        <button
          onClick={() => setActiveCard(null)}
          className="text-sm text-sf-dark hover:underline"
        >
          &larr; Back to Battle Cards
        </button>

        <div>
          <h2 className="text-2xl font-bold text-sf-dark">{klaviyoAiConnectData.title}</h2>
          <p className="text-sm text-sf-secondary mt-1">{klaviyoAiConnectData.description}</p>
        </div>

        <KlaviyoAiConnectView />
      </div>
    );
  }

  if (activeCard === 'good-call-bad-call') {
    return (
      <div className="space-y-8">
        <button
          onClick={() => setActiveCard(null)}
          className="text-sm text-sf-dark hover:underline"
        >
          &larr; Back to Battle Cards
        </button>

        <div>
          <h2 className="text-2xl font-bold text-sf-dark">Good Call vs Bad Call</h2>
          <p className="text-sm text-sf-secondary mt-1">What great calls look like across all 9 scoring areas</p>
        </div>

        <section>
          <MetricsTable metrics={guideData.metrics} />
        </section>

        <section>
          <h2 className="text-xl font-semibold text-sf-dark mb-4">The 9 Scoring Areas</h2>
          <div className="space-y-3">
            {guideData.scoringAreas.map((area, i) => (
              <ScoringAreaCard key={area.id} area={area} index={i} />
            ))}
          </div>
        </section>

        <section>
          <GoldenRules rules={guideData.goldenRules} />
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-sf-dark">Battle Cards</h2>
        <p className="text-sm text-sf-secondary mt-1">Quick-reference guides to sharpen your calls</p>
      </div>

      <div className="grid gap-4">
        {battleCards.map((card) => (
          <button
            key={card.id}
            onClick={() => setActiveCard(card.id)}
            className="bg-white rounded-xl border border-sf-border p-6 text-left hover:shadow-md hover:border-sf-dark/20 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-sf-dark group-hover:text-sf-dark/80">
                  {card.title}
                </h3>
                <p className="text-sm text-sf-secondary mt-0.5">{card.description}</p>
              </div>
              <svg
                className="w-5 h-5 text-sf-secondary group-hover:text-sf-dark transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
