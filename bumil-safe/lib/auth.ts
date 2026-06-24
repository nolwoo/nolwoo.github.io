import { createHash } from "crypto";

export const ADMIN_COOKIE = "bumil_admin";

/* 관리자 쿠키 토큰 — 비밀번호에서 파생. 값이 "1" 같은 고정값이 아니라
   비밀번호를 알아야 만들 수 있어 위조가 어렵다. */
export function adminToken(): string {
  const pw = process.env.ADMIN_PASSWORD || "";
  return createHash("sha256").update("bumil-safe:" + pw).digest("hex");
}
