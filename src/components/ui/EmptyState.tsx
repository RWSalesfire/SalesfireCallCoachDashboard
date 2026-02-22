'use client';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  className?: string;
}

export default function EmptyState({ icon = '✨', title, description, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`rounded-xl border border-sf-border bg-sf-card p-8 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="text-4xl block mb-3" aria-hidden>
        {icon}
      </span>
      <h3 className="card-title mb-1">{title}</h3>
      <p className="body-muted leading-relaxed max-w-sm mx-auto">{description}</p>
    </div>
  );
}
