// 아주 단순한 "메모리 기반" 사용량 제한기 (외부 의존성 0).
// 같은 IP가 짧은 시간에 너무 많이 호출하거나, 하루에 과도하게 호출하지
// 못하게 막는 1차 방어막이다.
//
// 주의: Vercel 서버리스는 요청마다 인스턴스가 여러 개로 나뉠 수 있어
// 이 메모리 카운트는 "완벽한" 상한이 아니라 "남용 둔화" 수준이다.
// 진짜 비용 상한은 Anthropic 콘솔의 지출 한도(Spending limit)로 건다.

const WINDOW_MS = 60 * 1000; // 1분 창
const MAX_PER_WINDOW = 8; // 1분에 8번까지 (사람이 대화하기엔 충분, 연타는 차단)
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_PER_DAY = 80; // 한 IP가 하루에 80번까지

// ip -> { times: number[], dayStart: number, dayCount: number }
const hits = new Map();
let lastSweep = Date.now();

/**
 * @param {string} ip 호출자 IP
 * @returns {{allowed: boolean, retryAfterSec?: number, reason?: 'minute'|'day'}}
 */
export function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip || 'unknown';

  sweep(now); // 가끔 오래된 기록 정리 (메모리 누수 방지)

  let rec = hits.get(key);
  if (!rec) {
    rec = { times: [], dayStart: now, dayCount: 0 };
    hits.set(key, rec);
  }

  // 하루 카운터 리셋
  if (now - rec.dayStart > DAY_MS) {
    rec.dayStart = now;
    rec.dayCount = 0;
  }

  // 분당 창: 1분보다 오래된 호출 기록은 버린다
  rec.times = rec.times.filter((t) => now - t < WINDOW_MS);

  if (rec.dayCount >= MAX_PER_DAY) {
    return { allowed: false, reason: 'day', retryAfterSec: Math.ceil((rec.dayStart + DAY_MS - now) / 1000) };
  }
  if (rec.times.length >= MAX_PER_WINDOW) {
    const earliest = rec.times[0];
    return { allowed: false, reason: 'minute', retryAfterSec: Math.ceil((earliest + WINDOW_MS - now) / 1000) };
  }

  rec.times.push(now);
  rec.dayCount += 1;
  return { allowed: true };
}

/** 요청 객체에서 호출자 IP를 최대한 추출한다 (Vercel/로컬 공통). */
export function clientIp(req) {
  const xff = req.headers && req.headers['x-forwarded-for'];
  if (xff) return String(xff).split(',')[0].trim();
  return (req.headers && req.headers['x-real-ip']) || req.socket?.remoteAddress || 'unknown';
}

// 하루에 한 번 정도, 더 이상 활동 없는 IP 기록을 정리한다.
function sweep(now) {
  if (now - lastSweep < DAY_MS) return;
  lastSweep = now;
  for (const [key, rec] of hits) {
    if (now - rec.dayStart > DAY_MS && rec.times.length === 0) hits.delete(key);
  }
}
