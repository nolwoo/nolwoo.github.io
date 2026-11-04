// 사용량 제한기 (외부 의존성 0).
// 같은 IP가 짧은 시간에 너무 많이 호출하거나, 하루에 과도하게 호출하지 못하게 막는다.
//
// 저장소는 두 가지다.
// 1) Upstash Redis (UPSTASH_REDIS_REST_URL·UPSTASH_REDIS_REST_TOKEN 이 설정된 경우)
//    — 모든 서버리스 인스턴스가 같은 카운터를 공유하므로 실제 상한으로 작동한다.
//    — 서비스 전체 하루 상한(GLOBAL_MAX_PER_DAY)도 함께 건다: IP를 바꿔 가며 호출해도
//      하루 총 호출 수는 이 값을 넘지 못한다.
// 2) 메모리 (환경변수가 없거나 Redis 호출이 실패한 경우)
//    — 인스턴스마다 따로 세므로 "완벽한" 상한이 아니라 "남용 둔화" 수준이다.
//
// 어느 쪽이든 진짜 비용 상한은 Anthropic 콘솔의 지출 한도(Spend limit)로 건다.
//
// IP: Vercel은 x-forwarded-for 헤더를 덮어써 IP 위조를 막는다
// (https://vercel.com/docs/headers/request-headers#x-forwarded-for).
// Vercel 앞에 다른 프록시를 두면 이 전제가 깨지니 주의.

const WINDOW_MS = 60 * 1000; // 1분 창
const MAX_PER_WINDOW = 8; // 1분에 8번까지 (사람이 대화하기엔 충분, 연타는 차단)
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_PER_DAY = 80; // 한 IP가 하루에 80번까지
const GLOBAL_MAX_PER_DAY = Number(process.env.GLOBAL_MAX_PER_DAY) || 1000; // 서비스 전체 하루 상한 (Redis 모드에서만)

const REDIS_URL = (process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/+$/, '');
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';

// ip -> { times: number[], dayStart: number, dayCount: number }
const hits = new Map();
let lastSweep = Date.now();

/**
 * @param {string} ip 호출자 IP
 * @returns {Promise<{allowed: boolean, retryAfterSec?: number, reason?: 'minute'|'day'|'global'}>}
 */
export async function checkRateLimit(ip) {
  const key = ip || 'unknown';
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      return await checkRedis(key);
    } catch (err) {
      // Redis 장애 시 서비스는 계속 돌되, 메모리 제한으로라도 막는다.
      console.error('[rateLimit] Redis 확인 실패, 메모리 제한으로 대체:', err.message);
    }
  }
  return checkMemory(key);
}

async function redisPipeline(commands) {
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`Upstash HTTP ${res.status}`);
  const out = await res.json();
  const failed = Array.isArray(out) ? out.find((r) => r && r.error) : { error: 'unexpected response' };
  if (failed) throw new Error(`Upstash ${failed.error}`);
  return out.map((r) => r.result);
}

// 고정 창(fixed window) 카운터. 키에 창 번호가 들어가 있어 EXPIRE를 매번 갱신해도 창이 늘어나지 않는다.
async function checkRedis(ip) {
  const now = Date.now();
  const minute = Math.floor(now / WINDOW_MS);
  const day = Math.floor(now / DAY_MS);
  const mk = `rl:m:${ip}:${minute}`;
  const dk = `rl:d:${ip}:${day}`;
  const [m, , d] = await redisPipeline([
    ['INCR', mk], ['EXPIRE', mk, 120],
    ['INCR', dk], ['EXPIRE', dk, 2 * 24 * 60 * 60],
  ]);
  const toNextDay = Math.ceil(((day + 1) * DAY_MS - now) / 1000);
  if (d > MAX_PER_DAY) return { allowed: false, reason: 'day', retryAfterSec: toNextDay };
  if (m > MAX_PER_WINDOW) {
    return { allowed: false, reason: 'minute', retryAfterSec: Math.ceil(((minute + 1) * WINDOW_MS - now) / 1000) };
  }
  // IP별 제한을 통과한 요청만 전체 카운터에 더한다 (막힌 요청이 전체 한도를 갉아먹지 않게).
  const gk = `rl:g:${day}`;
  const [g] = await redisPipeline([['INCR', gk], ['EXPIRE', gk, 2 * 24 * 60 * 60]]);
  if (g > GLOBAL_MAX_PER_DAY) return { allowed: false, reason: 'global', retryAfterSec: toNextDay };
  return { allowed: true };
}

function checkMemory(key) {
  const now = Date.now();

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
