/* 신뢰 항목 — 번호 + 제목 + 설명 (세 가지 기준: 정품·설치·A/S) */
export function TrustItem({
  no,
  title,
  desc,
  dark = false,
}: {
  no: string;
  title: string;
  desc: string;
  dark?: boolean;
}) {
  return (
    <div>
      <span className={`text-[15px] font-semibold ${dark ? "text-blue-on-dark" : "text-blue"}`}>
        {no}
      </span>
      <h4 className={`mt-3 text-[21px] font-semibold ${dark ? "text-on-dark" : "text-ink"}`}>
        {title}
      </h4>
      <p className={`mt-2 text-[15px] leading-relaxed ${dark ? "text-on-dark-muted" : "text-ink-muted"}`}>
        {desc}
      </p>
    </div>
  );
}
