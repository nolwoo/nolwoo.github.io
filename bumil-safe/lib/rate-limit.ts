/* best-effort IP rate limit (서버 인스턴스 메모리 기준).
   완벽한 분산 제한은 아니지만 단일 IP의 도배·무차별 대입을 크게 줄여준다. */

type Bucket = { windowMs: number; max: number; hits: Map<string, number[]> };

const buckets = new Map<string, Bucket>();

/* 이름별 독립 버킷. 같은 name이면 같은 제한을 공유한다. */
export function rateLimited(
  name: string,
  ip: string,
  opts: { windowMs: number; max: number },
): boolean {
  let bucket = buckets.get(name);
  if (!bucket) {
    bucket = { windowMs: opts.windowMs, max: opts.max, hits: new Map() };
    buckets.set(name, bucket);
  }

  const now = Date.now();
  const recent = (bucket.hits.get(ip) ?? []).filter((t) => now - t < bucket.windowMs);

  if (recent.length >= bucket.max) {
    bucket.hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  bucket.hits.set(ip, recent);

  // 빈 항목이 쌓이지 않도록 가끔 청소 (IP 키 무한 증가 방지)
  if (bucket.hits.size > 500) {
    for (const [k, v] of bucket.hits) {
      if (v.every((t) => now - t >= bucket.windowMs)) bucket.hits.delete(k);
    }
  }

  return false;
}

/* 요청에서 클라이언트 IP 추출 (Vercel은 x-forwarded-for 사용) */
export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
