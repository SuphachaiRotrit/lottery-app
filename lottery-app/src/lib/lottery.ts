// ประเภทข้อมูล
export interface LotteryResult {
  firstPrize: string;          // รางวัลที่ 1 (3 หลัก)
  secondPrize: string[];       // รางวัลที่ 2 จำนวน 3 รางวัล (3 หลักแต่ละรางวัล)
  adjacentNumbers: string[];   // เลขข้างเคียงรางวัลที่ 1 (บวก/ลบ 1)
  lastTwoDigits: string;       // เลขท้าย 2 ตัว
  drawnAt: string;             // วันเวลาที่สุ่ม (ISO format)
}

export interface CheckResult {
  number: string;
  prizes: string[];
  isWinner: boolean;
}

// สุ่มตัวเลข 3 หลัก (000-999)
function randomThreeDigit(): string {
  return Math.floor(Math.random() * 1000).toString().padStart(3, '0');
}

// สุ่มตัวเลข 2 หลัก (00-99)
function randomTwoDigit(): string {
  return Math.floor(Math.random() * 100).toString().padStart(2, '0');
}

// คำนวณเลขข้างเคียง ± 1 (วนรอบ: 000 ↔ 999)
function getAdjacentNumbers(num: string): [string, string] {
  const n = parseInt(num, 10);
  const lower = ((n - 1 + 1000) % 1000).toString().padStart(3, '0');
  const upper = ((n + 1) % 1000).toString().padStart(3, '0');
  return [lower, upper];
}

// ดำเนินการสุ่มรางวัลทั้งหมด
export function drawAllPrizes(): LotteryResult {
  const firstPrize = randomThreeDigit();

  // สุ่มรางวัลที่ 2 จำนวน 3 รางวัล ไม่ซ้ำกันและไม่ซ้ำกับรางวัลที่ 1
  const usedNumbers = new Set<string>([firstPrize]);
  const secondPrize: string[] = [];
  while (secondPrize.length < 3) {
    const num = randomThreeDigit();
    if (!usedNumbers.has(num)) {
      usedNumbers.add(num);
      secondPrize.push(num);
    }
  }

  // เลขข้างเคียงคำนวณจากรางวัลที่ 1 อัตโนมัติ
  const adjacentNumbers = getAdjacentNumbers(firstPrize);

  // สุ่มเลขท้าย 2 ตัว
  const lastTwoDigits = randomTwoDigit();

  return {
    firstPrize,
    secondPrize,
    adjacentNumbers,
    lastTwoDigits,
    drawnAt: new Date().toISOString(),
  };
}

// ตรวจสอบว่าเลขที่กรอกถูกรางวัลใดบ้าง
export function checkNumber(number: string, result: LotteryResult): CheckResult {
  const prizes: string[] = [];
  const paddedNumber = number.padStart(3, '0');

  // ตรวจรางวัลที่ 1
  if (paddedNumber === result.firstPrize) {
    prizes.push('รางวัลที่ 1');
  }

  // ตรวจรางวัลที่ 2
  if (result.secondPrize.includes(paddedNumber)) {
    prizes.push('รางวัลที่ 2');
  }

  // ตรวจเลขข้างเคียงรางวัลที่ 1
  if (result.adjacentNumbers.includes(paddedNumber)) {
    prizes.push('รางวัลเลขข้างเคียงรางวัลที่ 1');
  }

  // ตรวจเลขท้าย 2 ตัว
  const lastTwo = paddedNumber.slice(-2);
  if (lastTwo === result.lastTwoDigits) {
    prizes.push('รางวัลเลขท้าย 2 ตัว');
  }

  return {
    number: paddedNumber,
    prizes,
    isWinner: prizes.length > 0,
  };
}

// คีย์สำหรับ localStorage
const STORAGE_KEY = 'lottery_result';

// บันทึกผลการสุ่มลง localStorage
export function saveResult(result: LotteryResult): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  }
}

// โหลดผลการสุ่มครั้งล่าสุดจาก localStorage
export function loadResult(): LotteryResult | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data) as LotteryResult;
      } catch {
        return null;
      }
    }
  }
  return null;
}
