'use client';

import { useState } from 'react';
import { Playbook } from '@/types';

interface PlaybookSectionProps {
  playbook: Playbook;
}

function AccordionItem({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-sf-card/30 transition-colors"
      >
        <h3 className="text-lg font-semibold text-sf-dark">{title}</h3>
        <svg
          className={`w-5 h-5 text-sf-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export default function PlaybookSection({ playbook }: PlaybookSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-sf-dark">Playbook</h2>

      {/* WHY Connections */}
      <AccordionItem title="WHY Connections">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sf-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-sf-secondary w-1/3">
                  When you say...
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-sf-secondary">
                  Follow with...
                </th>
              </tr>
            </thead>
            <tbody>
              {playbook.whyConnections.map((item, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-sf-card/30'}
                >
                  <td className="py-3 px-2 text-sm text-sf-body align-top">
                    &ldquo;{item.feature}&rdquo;
                  </td>
                  <td className="py-3 px-2">
                    <div className="bg-sf-card rounded-lg p-3">
                      <p className="text-sm text-sf-body leading-relaxed">
                        {item.why}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AccordionItem>

      {/* Objection Responses */}
      <AccordionItem title="Objection Responses">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-sf-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-sf-secondary w-1/4">
                  Objection
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-sf-secondary">
                  Response
                </th>
              </tr>
            </thead>
            <tbody>
              {playbook.objectionResponses.map((item, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-sf-card/30'}
                >
                  <td className="py-3 px-2 text-sm font-medium text-sf-body align-top">
                    &ldquo;{item.objection}&rdquo;
                  </td>
                  <td className="py-3 px-2">
                    <p className="text-sm text-sf-body leading-relaxed">
                      {item.response}
                    </p>
                    {item.followUp && (
                      <p className="text-sm text-sf-secondary mt-2 italic">
                        Then: {item.followUp}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AccordionItem>

      {/* Case Studies */}
      <AccordionItem title="Case Studies by Sector">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playbook.caseStudies.map((study, idx) => (
            <div
              key={idx}
              className="bg-sf-card rounded-lg p-4 border border-sf-border/50"
            >
              <p className="text-xs font-medium text-sf-secondary uppercase tracking-wide mb-1">
                {study.sector}
              </p>
              <h4 className="font-semibold text-sf-body mb-2">{study.client}</h4>
              <p className="text-sf-good font-medium text-sm mb-2">{study.result}</p>
              <span className="inline-block bg-sf-dark text-white text-xs px-2 py-1 rounded">
                {study.product}
              </span>
            </div>
          ))}
        </div>
      </AccordionItem>
    </div>
  );
}
