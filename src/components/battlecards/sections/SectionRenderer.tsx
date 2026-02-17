'use client';

import type { PlaybookSection } from '@/data/chimpToChampData';
import HeroSection from './HeroSection';
import QuestionsSection from './QuestionsSection';
import TextSection from './TextSection';
import CallFlowSection from './CallFlowSection';
import ScriptSection from './ScriptSection';
import LiveScriptSection from './LiveScriptSection';

interface Props {
  section: PlaybookSection;
}

export default function SectionRenderer({ section }: Props) {
  switch (section.type) {
    case 'hero':
      return <HeroSection section={section} />;
    case 'questions':
      return <QuestionsSection section={section} />;
    case 'text':
      return <TextSection section={section} />;
    case 'call-flow':
      return <CallFlowSection section={section} />;
    case 'script':
      return <ScriptSection section={section} />;
    case 'live-script':
      return <LiveScriptSection section={section} />;
    case 'list':
      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-sf-dark">{section.heading}</h3>
          <div className="space-y-3">
            {section.items.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-sf-border shadow-card p-4"
              >
                <h4 className="font-semibold text-sf-dark text-sm">{item.title}</h4>
                <p className="text-sm text-sf-secondary mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}
