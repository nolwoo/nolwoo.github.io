import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken } from "@/lib/auth";

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
  if (password !== expected) {
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
