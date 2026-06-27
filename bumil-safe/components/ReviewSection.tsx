import type { Product } from "@/lib/products";
import { getReviews, ratingDist } from "@/lib/reviews";

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="text-gold" aria-label={`${rating}점`}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

export function ReviewSection({ product: p }: { product: Product }) {
  if (p.reviews === 0) return null;

  const reviews = getReviews(p.id);
  const dist = ratingDist(p.rating, p.reviews);
  const maxDist = Math.max(...Object.values(dist));

  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-[820px] px-6 py-16">
        {/* 헤더 */}
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-hairline pb-6">
          <h2 className="text-[22px] font-semibold text-ink">구매 후기</h2>
          <span className="text-[13px] text-ink-faint">
            네이버 스마트스토어 리뷰 {p.reviews.toLocaleString()}개
          </span>
        </div>

        {/* 요약 */}
        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-16">
          {/* 종합 점수 */}
          <div className="flex shrink-0 flex-col items-center gap-1">
            <span className="text-[56px] font-semibold leading-none text-ink">
              {p.rating}
            </span>
            <span className="text-[22px] text-gold">★★★★★</span>
            <span className="text-[13px] text-ink-faint">
              {p.reviews.toLocaleString()}개 리뷰
            </span>
          </div>

          {/* 별점 분포 바 */}
          <div className="flex-1 space-y-2">
            {([5, 4, 3, 2, 1] as const).map((star) => {
              const count = dist[star];
              const pct = maxDist > 0 ? Math.round((count / maxDist) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-6 shrink-0 text-right text-[13px] text-ink-faint">
                    {star}★
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-pill bg-parchment">
                    <div
                      className="h-full rounded-pill bg-gold"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-16 text-[12px] text-ink-faint">
                    {count.toLocaleString()}개
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 개별 리뷰 */}
        <ul className="mt-10 divide-y divide-hairline border-t border-hairline">
          {reviews.map((r) => (
            <li key={r.id} className="py-6">
              <div className="flex items-center gap-3">
                <span className="text-[15px] font-medium text-ink">{r.author}</span>
                <StarRow rating={r.rating} />
                <span className="text-[13px] text-ink-faint">{r.date}</span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                {r.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
