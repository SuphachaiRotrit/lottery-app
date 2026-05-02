'use client';

import { Icon } from '@iconify/react';
import { LotteryResult } from '@/lib/lottery';
import NumberSlot from './NumberSlot';

interface PrizeTableProps {
  result: LotteryResult | null;
  isAnimating: boolean;
}

export default function PrizeTable({ result, isAnimating }: PrizeTableProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl mx-auto">

      <div className="lg:col-span-2 glass-card rounded-2xl p-6 md:p-8 border-amber-500/20 hover:border-amber-500/40 transition-all duration-500 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Icon icon="icon-park-twotone:gold-medal-two" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold gradient-text">รางวัลที่ 1</h3>
              <p className="text-sm text-white/40">จำนวน 1 รางวัล</p>
            </div>
          </div>
          <div className="flex justify-center">
            <NumberSlot value={result?.firstPrize ?? null} size="large" delay={0} isAnimating={isAnimating} />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8 border-violet-500/20 hover:border-violet-500/40 transition-all duration-500 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Icon icon="streamline:hotel-two-star-remix" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold gradient-text-purple">รางวัลที่ 2</h3>
              <p className="text-sm text-white/40">จำนวน 3 รางวัล</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[0, 1, 2].map((i) => (
              <NumberSlot key={i} value={result?.secondPrize[i] ?? null} size="medium" delay={200 + i * 150} isAnimating={isAnimating} />
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Icon icon="qlementine-icons:sort-ranking-desc-16" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">เลขข้างเคียงรางวัลที่ 1</h3>
              <p className="text-sm text-white/40">จำนวน 2 รางวัล</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[0, 1].map((i) => (
              <NumberSlot key={i} value={result?.adjacentNumbers[i] ?? null} size="medium" delay={650 + i * 150} isAnimating={isAnimating} />
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 glass-card rounded-2xl p-6 md:p-8 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-500 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Icon icon="mynaui:two-square" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">รางวัลเลขท้าย 2 ตัว</h3>
              <p className="text-sm text-white/40">จำนวน 1 เลข (รวม 10 รางวัล)</p>
            </div>
          </div>
          <div className="flex justify-center">
            <NumberSlot value={result?.lastTwoDigits ?? null} size="medium" delay={950} isAnimating={isAnimating} />
          </div>
        </div>
      </div>
    </div>
  );
}
