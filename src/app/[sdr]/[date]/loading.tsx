'use client';

import { useState, useEffect } from 'react';

const steps = [
  { label: 'Fetching your calls', icon: '📞' },
  { label: 'Loading focus areas', icon: '🎯' },
  { label: 'Almost there…', icon: '✨' },
];

export default function Loading() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % steps.length);
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sf-card border border-sf-border/80 mb-6 animate-pulse">
          <span className="text-3xl">{steps[step].icon}</span>
        </div>
        <p className="text-sf-body font-medium">{steps[step].label}</p>
        <div className="flex justify-center gap-1.5 mt-4">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`inline-block w-2 h-2 rounded-full transition-all duration-300 ${
                i === step ? 'bg-sf-dark scale-125' : 'bg-sf-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
