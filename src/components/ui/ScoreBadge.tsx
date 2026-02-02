'use client';

interface ScoreBadgeProps {
  score: number | 'N/A';
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const getScoreColor = (s: number | 'N/A') => {
    if (s === 'N/A') return 'bg-gray-200 text-gray-600';
    if (s >= 7) return 'bg-sf-good text-sf-dark';
    if (s >= 5) return 'bg-sf-focus text-sf-dark';
    return 'bg-sf-alert text-white';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full font-medium
        ${getScoreColor(score)}
        ${sizeClasses[size]}
      `}
    >
      {score === 'N/A' ? 'N/A' : score.toFixed(1)}
    </span>
  );
}
