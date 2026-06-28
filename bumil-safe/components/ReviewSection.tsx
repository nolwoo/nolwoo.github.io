import type { Product } from "@/lib/products";
import { SITE } from "@/lib/site";

export function ReviewSection({ product: p }: { product: Product }) {
  if (p.reviews === 0) return null;

  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-[820px] px-6 py-16">
        <div className="rounded-lg border border-hairline bg-parchment px-8 py-12 text-center">
          <h2 className="text-[22px] font-semibold text-ink">구매 후기</h2>

          {/* 종합 점수 */}
          <div className="mt-6 flex flex-col items-center gap-1">
            <span className="text-[56px] font-semibold leading-none text-ink">
              {p.rating}
            </span>
            <span className="text-[22px] text-gold">★★★★★</span>
            <span className="text-[14px] text-ink-faint">
              네이버 스마트스토어 실제 구매 후기 {p.reviews.toLocaleString()}개
            </span>
          </div>

          {/* 스토어로 연결 */}
          <a
            href={SITE.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-1.5 rounded-pill bg-blue px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            스토어에서 후기 전체 보기 →
          </a>

          <p className="mt-4 text-[13px] text-ink-faint">
            실제 구매자가 네이버에 남긴 후기를 확인하실 수 있어요.
          </p>
        </div>
      </div>
    </section>
  );
}
