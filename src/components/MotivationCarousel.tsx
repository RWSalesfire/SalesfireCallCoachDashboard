'use client';

import { useState, useEffect } from 'react';

const messages = [
  "Every top SDR was terrible once. You're just early.",
  "Objections aren't rejections. They're just questions disguised as walls.",
  "If they say 'send me an email,' that's not a no. Push back.",
  "Connection rate is just maths. More dials = more connects. Keep going.",
  "The best call you'll ever make is the next one.",
  "No one gets good at this by reading. Dial.",
  "Your first 100 calls will be rough. Your next 100 will be better. Keep count.",
  "Prospects can smell fear. Fake confidence until it's real.",
  "If you're not cringing at calls from 3 months ago, you're not improving.",
  "Hung up on? Good. That call was never going anywhere anyway.",
  "Your quota doesn't care about your feelings. Neither should you.",
  "The gatekeeper isn't your enemy. Make them your ally.",
  "Voicemail is not a dead end. It's a brand impression.",
  "You're not bothering them. You're offering value. Act like it.",
  "The best SDRs don't hope for callbacks. They create urgency.",
];

export default function MotivationCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-sf-dark via-sf-dark/95 to-sf-dark overflow-hidden py-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 min-h-[3rem]">
          <span className="text-2xl flex-shrink-0">💬</span>
          <p
            className={`text-white text-center font-medium transition-all duration-500 ease-in-out ${
              isAnimating
                ? 'opacity-0 translate-y-4'
                : 'opacity-100 translate-y-0'
            }`}
          >
            &ldquo;{messages[currentIndex]}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
