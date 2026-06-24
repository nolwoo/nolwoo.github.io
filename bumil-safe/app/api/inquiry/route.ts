import { NextResponse } from "next/server";
import { getSupabase, INQUIRY_TABLE } from "@/lib/supabase";

/* best-effort IP rate limit (서버 인스턴스 메모리 기준).
   완벽한 분산 제한은 아니지만 단일 IP의 도배를 크게 줄여준다. */
const WINDOW_MS = 10 * 60 * 1000; // 10분
const MAX_HITS = 6;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

/* 구매자 상담 접수 — 폼 제출을 받아 Supabase에 저장 */
export async function POST(req: Request) {
  let body: {
    name?: string;
    phone?: string;
    product?: string;
    message?: string;
    website?: string; // 허니팟 (사람은 비움, 봇은 채움)
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  // 허니팟에 값이 있으면 봇 → 저장 없이 성공인 척 (봇에게 단서 안 줌)
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // IP 기준 rate limit
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "잠시 후 다시 시도해 주세요. (요청이 너무 많습니다)" },
      { status: 429 },
    );
  }

  const name = body.name?.trim();
  const phone = body.phone?.trim();
  const message = body.message?.trim();
  const product = body.product?.trim() || null;

  if (!name || !phone || !message) {
    return NextResponse.json(
      { error: "이름·연락처·문의 내용을 모두 입력해 주세요." },
      { status: 400 },
    );
  }

  // 과도한 입력 방지 (서버 측 길이 제한)
  if (
    name.length > 50 ||
    phone.length > 30 ||
    (product?.length ?? 0) > 100 ||
    message.length > 2000
  ) {
    return NextResponse.json(
      { error: "입력 길이가 너무 깁니다. 핵심만 적어 주세요." },
      { status: 400 },
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "상담 저장소가 아직 연결되지 않았습니다. 전화로 문의해 주세요." },
      { status: 503 },
    );
  }

  const { error } = await supabase
    .from(INQUIRY_TABLE)
    .insert({ name, phone, product, message, status: "신규" });

  if (error) {
    console.error("inquiry insert error:", error.message);
    return NextResponse.json(
      { error: "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
