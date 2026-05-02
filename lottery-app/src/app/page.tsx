'use client';

import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { LotteryResult, drawAllPrizes, checkNumber, saveResult, loadResult, CheckResult } from '@/lib/lottery';
import PrizeTable from '@/components/PrizeTable';
import CheckPrizeForm from '@/components/CheckPrizeForm';
import Confetti from '@/components/ui/Confetti';

export default function Home() {
  const [result, setResult] = useState<LotteryResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  useEffect(() => {
    const savedResult = loadResult();
    if (savedResult) {
      setResult(savedResult);
    }
  }, []);

  const triggerConfetti = useCallback(() => {
    setConfettiKey(prev => prev + 1);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
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
      triggerConfetti();
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
      <Confetti key={confettiKey} active={showConfetti} />

      <header className="relative z-10 pt-12 pb-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight">
            <span className="text-primary">
              ระบบสุ่มรางวัลล็อตเตอรี่
            </span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-light tracking-wide">
            Lottery Prize Drawing System — 3 ตัวเลข
          </p>
          {result?.drawnAt && (
            <p className="mt-2 text-xs text-slate-400">
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
              className="group relative px-10 py-5 rounded-2xl font-bold text-xl bg-primary text-white shadow-2xl shadow-primary/30 hover:opacity-90 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
            >
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
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs">
            <Icon icon="ph:magnifying-glass-bold" className="w-4 h-4" />
          </div>
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        <section className="max-w-6xl mx-auto" id="check-section">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="text-primary">
                ตรวจรางวัล
              </span>
            </h2>
            <p className="text-slate-500 text-sm">กรอกเลข 3 หลักเพื่อตรวจสอบผลรางวัล</p>
          </div>
          <CheckPrizeForm
            onCheck={handleCheck}
            hasDrawn={result !== null}
            onWin={triggerConfetti}
          />
        </section>
      </main>

      <footer className="relative z-10 py-8 text-center border-t border-slate-100 mt-12">
        <p className="text-xs text-slate-400 font-medium">
          © {new Date().getFullYear()} Lottery Prize System — Suphachai Rotrit
        </p>
      </footer>
    </>
  );
}
