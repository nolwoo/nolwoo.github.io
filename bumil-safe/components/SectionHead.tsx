import { ReactNode } from "react";

/* 섹션 헤더 — 블루 eyebrow(레터스페이스 캡스) + 디스플레이 제목 + 리드 */
export function SectionHead({
  eyebrow,
  title,
  lead,
  center = false,
  dark = false,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  center?: boolean;
  dark?: boolean;
  /** 페이지의 대표 제목에는 "h1"을 준다 (페이지당 하나 — 검색엔진 주제 신호) */
  as?: "h1" | "h2";
}) {
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && (
        <p
          className={`mb-3 text-[13px] font-semibold uppercase tracking-[0.22em] ${
            dark ? "text-blue-on-dark" : "text-blue"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={`tracking-tight-apple text-[clamp(25px,3.8vw,38px)] font-semibold leading-[1.25] ${
          dark ? "text-on-dark" : "text-ink"
        }`}
      >
        {title}
      </Heading>
      {lead && (
        <p
          className={`mt-4 text-[clamp(17px,2vw,21px)] leading-relaxed ${
            center ? "mx-auto" : ""
          } max-w-[640px] ${dark ? "text-on-dark-muted" : "text-ink-muted"}`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
