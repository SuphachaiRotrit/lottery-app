'use client';

import { useEffect, useState } from 'react';

// โครงสร้างข้อมูลชิ้น confetti แต่ละชิ้น
interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  delay: number;
  size: number;
  rotation: number;
  shape: 'square' | 'circle' | 'triangle';
}

export default function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ['#fbbf24', '#8b5cf6', '#06b6d4', '#10b981', '#f43f5e', '#ec4899', '#3b82f6'];
      const shapes: ConfettiPiece['shape'][] = ['square', 'circle', 'triangle'];
      const newPieces: ConfettiPiece[] = [];

      // สร้างชิ้น confetti จำนวน 60 ชิ้น
      for (let i = 0; i < 60; i++) {
        newPieces.push({
          id: i,
          left: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 2,
          size: Math.random() * 8 + 4,
          rotation: Math.random() * 360,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        });
      }

      setPieces(newPieces);

      // ล้าง confetti หลัง 4 วินาที
      const timeout = setTimeout(() => {
        setPieces([]);
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [active]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.shape !== 'triangle' ? piece.color : 'transparent',
            width: piece.size,
            height: piece.size,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            borderRadius: piece.shape === 'circle' ? '50%' : '0',
            borderLeft: piece.shape === 'triangle' ? `${piece.size / 2}px solid transparent` : undefined,
            borderRight: piece.shape === 'triangle' ? `${piece.size / 2}px solid transparent` : undefined,
            borderBottom: piece.shape === 'triangle' ? `${piece.size}px solid ${piece.color}` : undefined,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
