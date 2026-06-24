import Link from "next/link";
import type { Product } from "@/lib/products";

/* Apple store-utility-card — 흰 카드·헤어라인·18px 라운드. 그림자는 제품 이미지에만 */
export function ProductCard({ product: p }: { product: Product }) {
  return (
    <Link
      href={`/products/${p.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-hairline bg-canvas transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-parchment">
        {p.best && (
          <span className="absolute left-3 top-3 z-10 rounded-pill bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">
            BEST
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover [filter:drop-shadow(0_5px_30px_rgba(0,0,0,0.22))] transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[12px] text-ink-faint">
          {p.catLabel} · {p.lock}
        </p>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-ink">
          {p.name}
        </h3>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            {p.discount > 0 && (
              <span className="text-[14px] font-bold text-blue">
                {p.discount}%
              </span>
            )}
            <span className="text-[17px] font-bold text-ink">
              {p.price}원
            </span>
            {p.original && (
              <span className="text-[12px] text-ink-faint line-through">
                {p.original}
              </span>
            )}
          </div>
          {p.reviews > 0 && (
            <p className="mt-1 text-[12px] text-ink-faint">
              ★ {p.rating} · 리뷰 {p.reviews}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
