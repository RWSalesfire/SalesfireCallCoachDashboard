'use client';

import { MetricThreshold } from '@/data/guideData';

interface MetricsTableProps {
  metrics: MetricThreshold[];
}

export default function MetricsTable({ metrics }: MetricsTableProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-sf-dark mb-4">The Numbers That Matter</h2>
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sf-border">
                <th className="text-left px-4 py-3 font-semibold text-sf-dark">Metric</th>
                <th className="text-center px-4 py-3 font-semibold text-sf-dark">Target</th>
                <th className="text-center px-4 py-3 font-semibold text-sf-dark">Watch It</th>
                <th className="text-center px-4 py-3 font-semibold text-sf-dark">Problem</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m.metric} className="border-b border-sf-border/50 last:border-0">
                  <td className="px-4 py-3 font-medium text-sf-body">{m.metric}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-sf-good/20 text-sf-dark">
                      {m.green}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-sf-focus/30 text-sf-dark">
                      {m.amber}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-sf-alert/20 text-sf-alert">
                      {m.red}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
