import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { ADMIN_COOKIE, adminToken } from "@/lib/auth";
import { rateLimited, clientIp } from "@/lib/rate-limit";

/* 비밀번호 일정시간 비교 — 길이·내용에 따른 응답시간 차이로 추측당하지 않도록
   양쪽을 SHA-256(고정 길이)으로 만든 뒤 timingSafeEqual로 비교한다. */
function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/* 판매자 로그인 — 비밀번호 확인 후, 비밀번호 파생 토큰을 httpOnly 쿠키로 발급 */
export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: "관리자 비밀번호가 설정되지 않았습니다 (.env.local)." },
      { status: 503 },
    );
  }

  // 무차별 대입 방지 — 한 IP에서 10분에 10회까지만 시도 허용
  if (rateLimited("admin-login", clientIp(req), { windowMs: 10 * 60 * 1000, max: 10 })) {
    return NextResponse.json(
      { error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요." },
      { status: 429 },
    );
  }

  if (typeof password !== "string" || !passwordMatches(password, expected)) {
    return NextResponse.json(
      { error: "비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8시간
  });
  return res;
}

/* 로그아웃 — 쿠키 제거 후 /admin 으로 */
export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/admin", req.url));
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
