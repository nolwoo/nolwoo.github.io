"use client";

import { useSyncExternalStore } from "react";
import { SITE } from "@/lib/site";

const KEY = "bumil_banner_hidden_until";

/* 닫힘 상태 = localStorage 외부 저장소 → useSyncExternalStore로 읽음
   (effect 안 setState 회피 + SSR 하이드레이션 안전) */
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
function isHidden() {
  return Date.now() < (Number(localStorage.getItem(KEY)) || 0);
}
function dismiss() {
  localStorage.setItem(KEY, String(Date.now() + 24 * 60 * 60 * 1000));
  emit();
}

/* 상단 알림 띠 — 정품·설치 안내 + 전화. 1일 동안 닫힘 기억 */
export function TopBanner() {
  const hidden = useSyncExternalStore(subscribe, isHidden, () => false);
  if (hidden) return null;

  return (
    <div className="relative bg-ink text-on-dark">
      <div className="mx-auto flex max-w-[1120px] items-center justify-center gap-2 px-12 py-2.5 text-center text-[13px] leading-snug">
        <p>
          범일금고 <strong className="font-semibold text-on-dark">본사 정품</strong>을
          영등포에서 직접 설치해 드립니다 · 상담{" "}
          <a href={SITE.phoneHref} className="font-semibold text-gold-on-dark">
            {SITE.phone}
          </a>
        </p>
        <button
          aria-label="배너 닫기"
          onClick={dismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-sm px-2 py-1 text-on-dark-muted hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
