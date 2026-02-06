'use client';

import Link from 'next/link';
import { guideData } from '@/data/guideData';
import MetricsTable from './MetricsTable';
import ScoringAreaCard from './ScoringAreaCard';
import GoldenRules from './GoldenRules';

export default function GuideOverview() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-sf-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-sf-dark">Good Call vs Bad Call</h1>
              <p className="text-sm text-sf-secondary">What great calls look like across all 9 scoring areas</p>
            </div>
            <Link href="/" className="text-sm text-sf-dark hover:underline">
              &larr; Back to SDRs
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
      </main>

      <footer className="bg-white border-t border-sf-border mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-sf-secondary text-center">Salesfire Call Coaching Dashboard</p>
        </div>
      </footer>
    </div>
  );
}
