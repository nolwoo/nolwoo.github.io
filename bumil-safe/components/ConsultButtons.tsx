"use client";

import { SITE } from "@/lib/site";
import { Button } from "./Button";

/* 전환 동선 — 모든 페이지의 주 CTA는 이 컴포넌트로 통일 (CLAUDE.md 규칙) */
export function ConsultButtons({
  size = "md",
  className = "",
  showPhoneNumber = false,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  showPhoneNumber?: boolean;
}) {
  function onKakao(e: React.MouseEvent) {
    if (!SITE.kakaoUrl) {
      e.preventDefault();
      alert("카카오톡 상담 채널을 준비 중입니다.\n전화로 편히 문의해 주세요: " + SITE.phone);
      return;
    }
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <Button
        variant="kakao"
        size={size}
        href={SITE.kakaoUrl || "#"}
        onClick={onKakao}
        target={SITE.kakaoUrl ? "_blank" : undefined}
        rel="noopener"
      >
        💬 카카오톡 상담
      </Button>
      <Button variant="primary" size={size} href={SITE.phoneHref}>
        📞 {showPhoneNumber ? SITE.phone : "전화 상담"}
      </Button>
    </div>
  );
}
