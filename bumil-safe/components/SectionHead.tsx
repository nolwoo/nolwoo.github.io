import { ReactNode } from "react";

/* 섹션 헤더 — eyebrow(작은 라벨) + 제목(디스플레이) + 리드. Apple tight 자간 */
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
          className={`mb-3 text-[14px] font-semibold ${
            dark ? "text-blue-on-dark" : "text-blue"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`tracking-tight-apple text-[clamp(26px,4vw,40px)] font-semibold leading-[1.1] ${
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
