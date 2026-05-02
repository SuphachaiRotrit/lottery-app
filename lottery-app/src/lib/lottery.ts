export interface LotteryResult {
  firstPrize: string;
  secondPrize: string[];
  adjacentNumbers: string[];
  lastTwoDigits: string;
  drawnAt: string;
}

export interface CheckResult {
  number: string;
  prizes: string[];
  isWinner: boolean;
}

function randomThreeDigit(): string {
  return Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
}

function randomTwoDigit(): string {
  return Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
}
function getAdjacentNumbers(num: string): [string, string] {
  const n = parseInt(num, 10);
  const lower = ((n - 1 + 1000) % 1000).toString().padStart(3, "0");
  const upper = ((n + 1) % 1000).toString().padStart(3, "0");
  return [lower, upper];
}

export function drawAllPrizes(): LotteryResult {
  const firstPrize = randomThreeDigit();

  const usedNumbers = new Set<string>([firstPrize]);
  const secondPrize: string[] = [];
  while (secondPrize.length < 3) {
    const num = randomThreeDigit();
    if (!usedNumbers.has(num)) {
      usedNumbers.add(num);
      secondPrize.push(num);
    }
  }

  const adjacentNumbers = getAdjacentNumbers(firstPrize);

  const lastTwoDigits = randomTwoDigit();

  return {
    firstPrize,
    secondPrize,
    adjacentNumbers,
    lastTwoDigits,
    drawnAt: new Date().toISOString(),
  };
}

export function checkNumber(
  number: string,
  result: LotteryResult,
): CheckResult {
  const prizes: string[] = [];
  const paddedNumber = number.padStart(3, "0");

  if (paddedNumber === result.firstPrize) {
    prizes.push("รางวัลที่ 1");
  }

  if (result.secondPrize.includes(paddedNumber)) {
    prizes.push("รางวัลที่ 2");
  }

  if (result.adjacentNumbers.includes(paddedNumber)) {
    prizes.push("รางวัลเลขข้างเคียงรางวัลที่ 1");
  }

  const lastTwo = paddedNumber.slice(-2);
  if (lastTwo === result.lastTwoDigits) {
    prizes.push("รางวัลเลขท้าย 2 ตัว");
  }

  return {
    number: paddedNumber,
    prizes,
    isWinner: prizes.length > 0,
  };
}

const STORAGE_KEY = "lottery_result";

export function saveResult(result: LotteryResult): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  }
}

export function loadResult(): LotteryResult | null {
  if (typeof window !== "undefined") {
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
