'use client';

interface OutcomeBadgeProps {
  outcome: 'demo' | 'email' | 'not_interested' | 'warm_lead';
}

export default function OutcomeBadge({ outcome }: OutcomeBadgeProps) {
  const getOutcomeDisplay = (o: string) => {
    switch (o) {
      case 'demo':
        return { text: 'Demo ✓', color: 'text-sf-good' };
      case 'email':
        return { text: 'Email', color: 'text-sf-secondary' };
      case 'not_interested':
        return { text: 'Not interested', color: 'text-sf-secondary' };
      case 'warm_lead':
        return { text: 'Warm lead', color: 'text-sf-focus' };
      default:
        return { text: o, color: 'text-sf-secondary' };
    }
  };

  const display = getOutcomeDisplay(outcome);

  return (
    <span className={`text-sm font-medium ${display.color}`}>
      {display.text}
    </span>
  );
}
