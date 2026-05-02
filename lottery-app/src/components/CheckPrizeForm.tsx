'use client';

import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { CheckResult } from '@/lib/lottery';

interface CheckPrizeFormProps {
  onCheck: (number: string) => CheckResult | null;
  hasDrawn: boolean;
}

export default function CheckPrizeForm({ onCheck, hasDrawn }: CheckPrizeFormProps) {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // กรองให้รับเฉพาะตัวเลข และจำกัดไม่เกิน 3 หลัก
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setInputValue(value);
    if (showResult) {
      setShowResult(false);
      setResult(null);
    }
  };

  const handleCheck = () => {
    // ยังไม่ได้สุ่มรางวัล
    if (!hasDrawn) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setResult(null);
      setShowResult(true);
      return;
    }

    // ไม่ได้กรอกเลข
    if (inputValue.length === 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      inputRef.current?.focus();
      return;
    }

    // เติม 0 ด้านหน้าให้ครบ 3 หลัก แล้วตรวจรางวัล
    const paddedValue = inputValue.padStart(3, '0');
    const checkResult = onCheck(paddedValue);
    setResult(checkResult);
    setShowResult(true);
  };

  // กด Enter เพื่อตรวจรางวัลได้เลย
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ช่องกรอกเลขและปุ่มตรวจ */}
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
            className="w-full sm:w-72 px-6 py-4 text-2xl text-center number-display bg-white/[0.05] border-2 border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 placeholder:text-white/20 text-white transition-all duration-300 hover:border-white/20"
          />
        </div>

        <button
          onClick={handleCheck}
          id="btn-check"
          className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Icon icon="ph:magnifying-glass-bold" className="w-5 h-5" />
          ตรวจรางวัล
        </button>
      </div>

      {/* แสดงผลการตรวจ */}
      {showResult && (
        <div className="mt-8 animate-fade-in-up">
          {!hasDrawn ? (
            // ยังไม่ได้สุ่มรางวัล
            <div className="glass-card rounded-2xl p-6 border-amber-500/30 text-center">
              <Icon icon="ph:warning-fill" className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <p className="text-lg text-amber-300 font-medium">กรุณาสุ่มรางวัลก่อนตรวจ</p>
              <p className="text-sm text-white/40 mt-1">กดปุ่ม &quot;ดำเนินการสุ่มรางวัล&quot; ด้านบน</p>
            </div>
          ) : result?.isWinner ? (
            // ถูกรางวัล
            <div className="glass-card rounded-2xl p-6 border-emerald-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-emerald-500/5" />
              <div className="relative z-10 text-center">
                <Icon icon="ph:confetti-fill" className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-emerald-300 mb-2">ยินดีด้วย!</h4>
                <p className="text-lg text-white/80">
                  หมายเลข{' '}
                  <span className="number-display text-xl font-bold text-white bg-white/10 px-3 py-1 rounded-lg">
                    {result.number}
                  </span>
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {result.prizes.map((prize, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-200 flex items-center gap-1.5"
                    >
                      <Icon icon="ph:check-circle-fill" className="w-4 h-4" />
                      {prize}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-white/60 text-sm">
                  {result.number} ถูก{result.prizes.join(' และ ')}
                </p>
              </div>
            </div>
          ) : (
            // ไม่ถูกรางวัล
            <div className="glass-card rounded-2xl p-6 border-rose-500/30 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-pink-500/5 to-rose-500/5" />
              <div className="relative z-10">
                <Icon icon="ph:smiley-sad-fill" className="w-14 h-14 text-rose-400 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-rose-300 mb-2">เสียใจด้วย</h4>
                <p className="text-white/60">
                  หมายเลข{' '}
                  <span className="number-display font-bold text-white bg-white/10 px-3 py-1 rounded-lg">
                    {result?.number}
                  </span>{' '}
                  ไม่ถูกรางวัลใดๆ
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
