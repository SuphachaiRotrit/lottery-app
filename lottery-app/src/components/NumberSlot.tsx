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

  // คลาส CSS ตามขนาดที่เลือก
  const sizeClasses = {
    large: 'text-5xl md:text-7xl px-6 py-4 min-w-[180px] md:min-w-[240px]',
    medium: 'text-3xl md:text-5xl px-4 py-3 min-w-[120px] md:min-w-[160px]',
    small: 'text-2xl md:text-3xl px-3 py-2 min-w-[80px] md:min-w-[100px]',
  };

  // เมื่อ animation สิ้นสุด ป้องกันไม่ให้เล่นซ้ำ
  const handleAnimationEnd = () => {
    setHasAnimated(true);
  };

  // กรณียังไม่มีเลข แสดงช่องว่าง
  if (!value) {
    return (
      <div className={`${sizeClasses[size]} number-display rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/20 font-bold tracking-widest transition-all duration-300`}>
        {size === 'small' ? '--' : '---'}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} number-display rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 flex items-center justify-center font-bold tracking-widest transition-all duration-300 hover:border-white/30 hover:from-white/[0.12] hover:to-white/[0.04] hover:scale-105 ${isAnimating && !hasAnimated ? 'animate-slot-spin' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      onAnimationEnd={handleAnimationEnd}
    >
      <span className="bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
        {value}
      </span>
    </div>
  );
}
