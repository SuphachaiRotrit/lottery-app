'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { CheckResult } from '@/lib/lottery';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CheckResult | null;
}

export default function ResultModal({ isOpen, onClose, result }: ResultModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setShow(false), 300);
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-md glass-card rounded-3xl p-8 shadow-2xl transition-all duration-500 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Icon icon="ph:x-bold" className="w-5 h-5" />
        </button>

        <div className="text-center">
          {result?.isWinner ? (
            <>
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Icon icon="ph:confetti-fill" className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-black text-emerald-600 mb-2">ยินดีด้วย!</h3>
              <p className="text-slate-500 mb-6 font-medium">คุณถูกรางวัลสลากกินแบ่ง</p>

              <div className="bg-primary/5 rounded-2xl p-4 mb-6 border border-primary/10">
                <p className="text-xs text-primary/60 uppercase tracking-widest font-bold mb-1">หมายเลขของคุณ</p>
                <p className="text-4xl font-black text-primary number-display tracking-widest">{result.number}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {result.prizes.map((prize, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full text-sm font-bold bg-white border border-emerald-100 text-emerald-700 shadow-sm flex items-center gap-2"
                  >
                    <Icon icon="ph:check-circle-fill" className="w-4 h-4" />
                    {prize}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="ph:smiley-sad-fill" className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">เสียใจด้วยนะ</h3>
              <p className="text-slate-500 mb-6">ครั้งนี้ยังไม่ถูกรางวัล พยายามใหม่นะ!</p>

              <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">หมายเลขที่ตรวจ</p>
                <p className="text-3xl font-bold text-slate-600 number-display tracking-widest">{result?.number}</p>
              </div>
            </>
          )}

          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-slate-900 text-white hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/20"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
}
