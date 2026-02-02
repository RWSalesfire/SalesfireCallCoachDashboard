'use client';

interface StatCardProps {
  value: string | number;
  label: string;
  comparison?: {
    value: number;
    isHigher: boolean;
  };
  suffix?: string;
}

export default function StatCard({ value, label, comparison, suffix = '' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-semibold text-sf-dark">
          {value}{suffix}
        </span>
        {comparison && (
          <span className={`text-sm font-medium ${comparison.isHigher ? 'text-sf-good' : 'text-sf-focus'}`}>
            {comparison.isHigher ? '↑' : '↓'}
          </span>
        )}
      </div>
      <p className="text-sm text-sf-secondary mt-1">{label}</p>
    </div>
  );
}
