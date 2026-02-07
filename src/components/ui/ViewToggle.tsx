'use client';

type ViewType = 'daily' | 'weekly' | 'last30days';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const tabs: { value: ViewType; label: string }[] = [
  { value: 'daily', label: 'Overview' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'last30days', label: 'Last 30 Days' },
];

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg bg-sf-card p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onViewChange(tab.value)}
          className={`
            px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
            ${currentView === tab.value
              ? 'bg-sf-dark text-white shadow-sm'
              : 'text-sf-body hover:bg-white/50'}
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
