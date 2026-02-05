'use client';

interface ViewToggleProps {
  currentView: 'daily' | 'weekly';
  onViewChange: (view: 'daily' | 'weekly') => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg bg-sf-card p-1">
      <button
        onClick={() => onViewChange('daily')}
        className={`
          px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
          ${currentView === 'daily'
            ? 'bg-sf-dark text-white shadow-sm'
            : 'text-sf-body hover:bg-white/50'}
        `}
      >
        Overview
      </button>
      <button
        onClick={() => onViewChange('weekly')}
        className={`
          px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
          ${currentView === 'weekly'
            ? 'bg-sf-dark text-white shadow-sm'
            : 'text-sf-body hover:bg-white/50'}
        `}
      >
        Weekly
      </button>
    </div>
  );
}
