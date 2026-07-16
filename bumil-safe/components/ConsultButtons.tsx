"use client";

import { SITE } from "@/lib/site";
import { Button } from "./Button";

/* 아이콘 — 이모지 대신 라인 SVG (프리미엄 톤 유지) */
function ChatIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.53 1.46 4.78 3.73 6.24-.14.5-.5 1.8-.58 2.08-.09.35.13.35.27.25.11-.07 1.79-1.2 2.52-1.7.66.1 1.35.16 2.06.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

/* 전환 동선 — 모든 페이지의 주 CTA는 이 컴포넌트로 통일 (CLAUDE.md 규칙) */
export function ConsultButtons({
  size = "md",
  className = "",
  showPhoneNumber = false,
  onDark = false,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  showPhoneNumber?: boolean;
  onDark?: boolean;
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
        <ChatIcon /> 카카오톡 상담
      </Button>
      <Button variant={onDark ? "light" : "primary"} size={size} href={SITE.phoneHref}>
        <PhoneIcon /> {showPhoneNumber ? SITE.phone : "전화 상담"}
      </Button>
    </div>
  );
}
