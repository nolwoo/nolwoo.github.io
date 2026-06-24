import Link from "next/link";
import { NAV, SITE } from "@/lib/site";

/* Apple footer — 파치먼트 면, 느슨한 줄간격의 링크 컬럼, 미세 법적 고지 */
export function Footer() {
  return (
    <footer className="mt-auto bg-parchment text-ink-muted">
      <div className="mx-auto max-w-[1120px] px-6 py-16">
        <div className="flex flex-wrap justify-between gap-10 border-b border-hairline pb-10">
          <div className="max-w-[320px]">
            <p className="text-[17px] font-semibold text-ink">
              {SITE.brand}{" "}
              <em className="not-italic text-ink-faint">{SITE.branch}</em>
            </p>
            <p className="mt-2 text-[14px] leading-relaxed">
              가정용 · 사무용 금고 전문 판매 · 설치 · A/S.
              <br />
              본사 정품을 영등포에서 직접 설치해 드립니다.
            </p>
          </div>

          <div className="flex gap-14">
            <div>
              <h5 className="mb-3 text-[14px] font-semibold text-ink">둘러보기</h5>
              <ul className="space-y-1.5 text-[14px]">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-blue">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="mb-3 text-[14px] font-semibold text-ink">상담</h5>
              <ul className="space-y-1.5 text-[14px]">
                <li>
                  <a href={SITE.phoneHref} className="hover:text-blue">
                    {SITE.phone}
                  </a>
                </li>
                <li>{SITE.address.hours}</li>
                <li>{SITE.address.road}</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="pt-6 text-[12px] text-ink-faint">
          © 2026 {SITE.brand} {SITE.branch}. 본 사이트는 샘플 데모이며, 가격·재고는
          상담 시 확정됩니다.
        </p>
      </div>
    </footer>
  );
}
