"use client";

import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import { trackConsult } from "@/lib/track";

/* 서버 컴포넌트(푸터 등) 안에서도 전화 클릭을 GA4로 추적하기 위한 작은 클라이언트 래퍼.
   주 상담 CTA는 ConsultButtons를 쓰고, 이건 부가 위치의 전화번호 링크용. */
export function PhoneLink({
  children,
  className = "",
  location = "page",
}: {
  children: ReactNode;
  className?: string;
  location?: string;
}) {
  return (
    <a
      href={SITE.phoneHref}
      className={className}
      onClick={() => trackConsult("phone", location)}
    >
      {children}
    </a>
  );
}
