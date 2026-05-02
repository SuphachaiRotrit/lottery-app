'use client';

import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { LotteryResult, drawAllPrizes, checkNumber, saveResult, loadResult, CheckResult } from '@/lib/lottery';
import ParticlesBackground from '@/components/ParticlesBackground';
import PrizeTable from '@/components/PrizeTable';
import CheckPrizeForm from '@/components/CheckPrizeForm';
import Confetti from '@/components/Confetti';

export default function Home() {
  const [result, setResult] = useState<LotteryResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  // โหลดผลการสุ่มครั้งล่าสุดเมื่อเปิดหน้าเว็บ
  useEffect(() => {
    const savedResult = loadResult();
    if (savedResult) {
      setResult(savedResult);
    }
  }, []);

  // ฟังก์ชันสุ่มรางวัล
  const handleDraw = useCallback(() => {
    if (isDrawing) return;
    setIsDrawing(true);
    setIsAnimating(true);

    setTimeout(() => {
      const newResult = drawAllPrizes();
      setResult(newResult);
      saveResult(newResult);

      setConfettiKey(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      setTimeout(() => {
        setIsAnimating(false);
        setIsDrawing(false);
      }, 1500);
    }, 300);
  }, [isDrawing]);

  // ฟังก์ชันตรวจรางวัล
  const handleCheck = useCallback((number: string): CheckResult | null => {
    if (!result) return null;
    return checkNumber(number, result);
  }, [result]);

  return (
    <>
      <ParticlesBackground />
      <Confetti key={confettiKey} active={showConfetti} />

      <header className="relative z-10 pt-8 pb-4 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-float">
              <Icon icon="noto:slot-machine" className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-200 bg-clip-text text-transparent">
              ระบบสุ่มรางวัลล็อตเตอรี่
            </span>
          </h1>
          <p className="text-white/40 text-sm md:text-base font-light tracking-wide">
            Lottery Prize Drawing System — 3 ตัวเลข
          </p>
          {result?.drawnAt && (
            <p className="mt-2 text-xs text-white/25">
              สุ่มล่าสุดเมื่อ: {new Date(result.drawnAt).toLocaleString('th-TH')}
            </p>
          )}
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4 pb-12">
        <section className="max-w-6xl mx-auto mb-12" id="draw-section">
          <div className="text-center mb-8">
            <button
              onClick={handleDraw}
              disabled={isDrawing}
              id="btn-draw"
              className="group relative px-10 py-5 rounded-2xl font-bold text-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-gray-900 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <span className="relative z-10 flex items-center gap-3">
                <Icon
                  icon={isDrawing ? 'svg-spinners:ring-resize' : 'ph:shuffle-bold'}
                  className="w-6 h-6"
                />
                {isDrawing ? 'กำลังสุ่ม...' : 'ดำเนินการสุ่มรางวัล'}
              </span>
            </button>
          </div>

          <PrizeTable result={result} isAnimating={isAnimating} />
        </section>

        <div className="max-w-4xl mx-auto mb-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30">
            <Icon icon="ph:magnifying-glass-bold" className="w-4 h-4" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <section className="max-w-6xl mx-auto" id="check-section">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                ตรวจรางวัล
              </span>
            </h2>
            <p className="text-white/40 text-sm">กรอกเลข 3 หลักเพื่อตรวจสอบผลรางวัล</p>
          </div>
          <CheckPrizeForm onCheck={handleCheck} hasDrawn={result !== null} />
        </section>
      </main>

      <footer className="relative z-10 py-6 text-center border-t border-white/5">
        <p className="text-xs text-white/20">
          © 2026 Lottery Prize System — Suphachai Rotrit
        </p>
      </footer>
    </>
  );
}
