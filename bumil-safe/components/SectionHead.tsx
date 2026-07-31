import { ReactNode } from "react";

/* 섹션 헤더 — 블루 eyebrow(레터스페이스 캡스) + 디스플레이 제목 + 리드 */
export function SectionHead({
  eyebrow,
  title,
  lead,
  center = false,
  dark = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  center?: boolean;
  dark?: boolean;
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
      <h2
        className={`tracking-tight-apple text-[clamp(25px,3.8vw,38px)] font-semibold leading-[1.25] ${
          dark ? "text-on-dark" : "text-ink"
        }`}
      >
        {title}
      </h2>
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
