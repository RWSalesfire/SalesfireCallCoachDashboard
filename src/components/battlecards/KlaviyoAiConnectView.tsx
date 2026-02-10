'use client';

import { useState } from 'react';
import { klaviyoAiConnectData } from '@/data/klaviyoAiConnectData';
import SectionRenderer from './sections/SectionRenderer';

export default function KlaviyoAiConnectView() {
  const { tabOrder, sections } = klaviyoAiConnectData;
  const [activeTab, setActiveTab] = useState(tabOrder[0]);

  const tabs = tabOrder
    .map((id) => sections.find((s) => s.id === id))
    .filter(Boolean);

  const activeSection = sections.find((s) => s.id === activeTab);

  return (
    <div className="space-y-6">
      {/* Sticky horizontal tab strip */}
      <div className="sticky top-0 z-10 -mx-1 px-1 bg-white/95 backdrop-blur pb-2 pt-1">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            if (!tab) return null;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sf-dark text-white'
                    : 'text-sf-secondary hover:text-sf-dark hover:bg-sf-card'
                }`}
              >
                {tab.tabLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active section content */}
      {activeSection && <SectionRenderer section={activeSection} />}
    </div>
  );
}
