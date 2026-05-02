'use client';

import { useState } from 'react';

interface NumberSlotProps {
  value: string | null;
  size?: 'large' | 'medium' | 'small';
  delay?: number;
  isAnimating?: boolean;
}

export default function NumberSlot({ value, size = 'medium', delay = 0, isAnimating = false }: NumberSlotProps) {
  const [hasAnimated, setHasAnimated] = useState(false);

  const sizeClasses = {
    large: 'text-5xl md:text-7xl px-6 py-4 min-w-[180px] md:min-w-[240px]',
    medium: 'text-3xl md:text-5xl px-4 py-3 min-w-[120px] md:min-w-[160px]',
    small: 'text-2xl md:text-3xl px-3 py-2 min-w-[80px] md:min-w-[100px]',
  };

  const handleAnimationEnd = () => {
    setHasAnimated(true);
  };

  if (!value) {
    return (
      <div className={`${sizeClasses[size]} number-display rounded-xl bg-slate-100/50 border border-slate-200 flex items-center justify-center text-slate-300 font-bold tracking-widest transition-all duration-300`}>
        {size === 'small' ? '--' : '---'}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} number-display rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center font-bold tracking-widest transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:scale-105 ${isAnimating && !hasAnimated ? 'animate-slot-spin' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      onAnimationEnd={handleAnimationEnd}
    >
      <span className="bg-linear-to-b from-slate-800 to-slate-600 bg-clip-text text-transparent">
        {value}
      </span>
    </div>
  );
}
