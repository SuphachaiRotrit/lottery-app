'use client';

import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { CheckResult } from '@/lib/lottery';
import ResultModal from './ui/ResultModal';

interface CheckPrizeFormProps {
  onCheck: (number: string) => CheckResult | null;
  hasDrawn: boolean;
  onWin?: () => void;
}

export default function CheckPrizeForm({ onCheck, hasDrawn, onWin }: CheckPrizeFormProps) {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setInputValue(value);
    if (showResult) {
      setShowResult(false);
      setResult(null);
    }
  };

  const handleCheck = () => {
    if (!hasDrawn) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setResult(null);
      setShowResult(true);
      return;
    }

    if (inputValue.length === 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      inputRef.current?.focus();
      return;
    }

    const paddedValue = inputValue.padStart(3, '0');
    const checkResult = onCheck(paddedValue);

    if (checkResult?.isWinner) {
      onWin?.();
    }

    setResult(checkResult);
    setShowResult(true);
    setIsModalOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        style={isShaking ? { animation: 'shake 0.5s ease-in-out' } : {}}
      >
        <div className="relative w-full sm:w-auto">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={3}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="กรอกเลข 3 หลัก"
            id="check-input"
            className="w-full sm:w-72 px-6 py-4 text-2xl text-center number-display bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-300 text-slate-800 transition-all duration-300 hover:border-slate-300 shadow-sm"
          />
        </div>

        <button
          onClick={handleCheck}
          id="btn-check"
          className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Icon icon="ph:magnifying-glass-bold" className="w-5 h-5" />
          ตรวจรางวัล
        </button>
      </div>

      {showResult && (
        <div className="mt-8 animate-fade-in-up">
          {!hasDrawn ? (
            <div className="glass-card rounded-2xl p-6 border-amber-200 text-center">
              <Icon icon="ph:warning-fill" className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <p className="text-lg text-amber-600 font-medium">กรุณาสุ่มรางวัลก่อนตรวจ</p>
              <p className="text-sm text-slate-500 mt-1">กดปุ่ม &quot;ดำเนินการสุ่มรางวัล&quot; ด้านบน</p>
            </div>
          ) : result?.isWinner ? (
            <div className="glass-card rounded-2xl p-6 border-emerald-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-emerald-500/5 via-green-500/5 to-emerald-500/5" />
              <div className="relative z-10 text-center">
                <Icon icon="ph:confetti-fill" className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-emerald-600 mb-2">ยินดีด้วย!</h4>
                <p className="text-lg text-slate-700">
                  หมายเลข{' '}
                  <span className="number-display text-xl font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                    {result.number}
                  </span>
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {result.prizes.map((prize, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full text-sm font-semibold bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center gap-1.5 shadow-sm"
                    >
                      <Icon icon="ph:check-circle-fill" className="w-4 h-4" />
                      {prize}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-slate-500 text-sm">
                  {result.number} ถูก{result.prizes.join(' และ ')}
                </p>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 border-rose-200 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-rose-500/5 via-pink-500/5 to-rose-500/5" />
              <div className="relative z-10">
                <Icon icon="ph:smiley-sad-fill" className="w-14 h-14 text-rose-500 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-rose-600 mb-2">เสียใจด้วย</h4>
                <p className="text-slate-600">
                  หมายเลข{' '}
                  <span className="number-display font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                    {result?.number}
                  </span>{' '}
                  ไม่ถูกรางวัลใดๆ
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      <ResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={result}
      />
    </div>
  );
}
