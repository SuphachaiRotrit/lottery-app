# ระบบสุ่มรางวัลและตรวจรางวัลล็อตเตอรี่ 3 หลัก

> **แบบทดสอบตำแหน่ง Front-end Developer**

---

## Tech Stack

| ชั้น | เทคโนโลยี |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| ภาษา | TypeScript |
| Styling | Tailwind CSS v4 |
| ฟอนต์ | Prompt (ภาษาไทย) + Orbitron (ตัวเลข) |
| State | React `useState` / `useCallback` |
| จัดเก็บข้อมูล | `localStorage` |
| Deploy | Vercel |

---

## รายการรางวัล

| รางวัล | จำนวน | คำอธิบาย |
|--------|--------|----------|
| รางวัลที่ 1 | 1 รางวัล | ตัวเลข 3 หลัก สุ่มโดยตรง |
| รางวัลที่ 2 | 3 รางวัล | ตัวเลข 3 หลัก ไม่ซ้ำกันและไม่ซ้ำกับรางวัลที่ 1 |
| เลขข้างเคียงรางวัลที่ 1 | 2 รางวัล | รางวัลที่ 1 ± 1 (วนรอบ: 000↔999) |
| เลขท้าย 2 ตัว | 1 เลข (10 รางวัล) | ตัวเลข 2 หลัก สุ่มโดยตรง |

---

## โครงสร้างโปรเจกต์

```
lottery-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Layout หลัก, ฟอนต์, metadata
│   │   ├── page.tsx          # หน้าหลัก (จัดการ state ทั้งหมด)
│   │   └── globals.css       # Tailwind + animation ต่างๆ
│   ├── components/
│   │   ├── ParticlesBackground.tsx  # พื้นหลัง particle แบบ canvas
│   │   ├── PrizeTable.tsx           # ตาราง 4 การ์ดแสดงผลรางวัล
│   │   ├── NumberSlot.tsx           # ช่องแสดงตัวเลขพร้อม animation
│   │   ├── CheckPrizeForm.tsx       # ฟอร์มตรวจรางวัล + แสดงผล
│   │   └── Confetti.tsx             # เอฟเฟกต์ confetti ฉลองรางวัล
│   └── lib/
│       └── lottery.ts        # Logic หลัก: สุ่ม, ตรวจ, localStorage
├── vercel.json
└── package.json
```

---

## การรัน Local

```bash
cd lottery-app
npm install
npm run dev
# เปิด http://localhost:3000
```

---

## Deploy บน Vercel

### วิธีที่ 1: Vercel CLI

```bash
npm install -g vercel
cd lottery-app
vercel --prod
```

### วิธีที่ 2: GitHub + Vercel Dashboard

1. Push โค้ดขึ้น GitHub Repository
2. ไปที่ [vercel.com](https://vercel.com) → **New Project**
3. Import repository ที่ต้องการ
4. ตั้ง **Root Directory** เป็น `lottery-app`
5. กด **Deploy** — Vercel จะ detect Next.js อัตโนมัติ

> ไม่ต้องใช้ MongoDB เนื่องจากระบบนี้ไม่มีการเก็บข้อมูลฝั่ง server
> ผลการสุ่มถูกเก็บใน `localStorage` ของ browser ตามที่โจทย์กำหนด

---

## Logic สำคัญ

### การสุ่มรางวัล (`src/lib/lottery.ts`)
- สุ่มเลข 3 หลัก (000–999) ด้วย `Math.random()`
- รางวัลที่ 2 สุ่มให้ไม่ซ้ำกันและไม่ซ้ำกับรางวัลที่ 1
- เลขข้างเคียงคำนวณจาก `(รางวัลที่ 1 ± 1 + 1000) % 1000` (วนรอบ)
- บันทึกผลลงใน `localStorage` ทันทีหลังสุ่ม

### การตรวจรางวัล
- เปรียบเทียบเลขที่กรอก (เติม 0 ให้ครบ 3 หลัก) กับทุกรางวัล
- สำหรับเลขท้าย 2 ตัว ใช้ `.slice(-2)` เพื่อดึง 2 หลักท้าย
- แสดงรายการรางวัลที่ถูกทั้งหมด เช่น "331 ถูกรางวัลที่ 2 และรางวัลเลขท้าย 2 ตัว"
