'use client';

interface TeamAveragesGridProps {
  averages: Record<string, number>;
}

const AREA_ORDER = ['gatekeeper', 'opener', 'personalisation', 'discovery', 'callControl', 'toneEnergy', 'valueProp', 'objections', 'close'];

const AREA_LABELS: Record<string, string> = {
  gatekeeper: 'Gate',
  opener: 'Open',
  personalisation: 'Pers',
  discovery: 'Disc',
  callControl: 'Ctrl',
  toneEnergy: 'Tone',
  valueProp: 'VP',
  objections: 'Obj',
  close: 'Close',
};

function getScoreBg(score: number): string {
  if (score >= 7) return 'bg-sf-good/20';
  if (score >= 5) return 'bg-sf-focus/30';
  return 'bg-sf-alert/20';
}

export default function TeamAveragesGrid({ averages }: TeamAveragesGridProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-sf-dark mb-4">Team Averages</h2>
      <div className="bg-white rounded-xl p-6 shadow-card">
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {AREA_ORDER.map((area) => {
            const score = averages[area] || 0;
            return (
              <div key={area} className="text-center">
                <div className="text-xs text-sf-secondary mb-1">{AREA_LABELS[area]}</div>
                <div className={`rounded-lg py-2 ${getScoreBg(score)}`}>
                  <span className="text-sm font-medium text-sf-body">{score.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
