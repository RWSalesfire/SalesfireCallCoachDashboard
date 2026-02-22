'use client';

type ViewType = 'daily' | 'weekly' | 'last30days' | 'library' | 'battlecards';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const tabs: { value: ViewType; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'library', label: 'Library' },
  { value: 'battlecards', label: 'Battle Cards' },
];

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <nav className="inline-flex rounded-xl bg-sf-card p-1.5 gap-0.5" aria-label="Dashboard views">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onViewChange(tab.value)}
          className={`
            px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
            ${currentView === tab.value
              ? 'bg-sf-dark text-white shadow-sm'
              : 'text-sf-body hover:bg-white/70 hover:text-sf-dark'}
          `}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
