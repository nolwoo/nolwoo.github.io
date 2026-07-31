import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ConsultButtons } from "@/components/ConsultButtons";
import { ProductCard } from "@/components/ProductCard";
import { ReviewSection } from "@/components/ReviewSection";
import { PRODUCTS } from "@/lib/products";
import { getProduct } from "@/lib/catalog";

// 정적 생성 — 40종을 미리 빌드 (검색·공유 대응)
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

// 제품별 메타데이터 (링크 공유·검색 노출)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) return { title: "제품을 찾을 수 없습니다" };
  return {
    title: p.name,
    description: `${p.catLabel} · ${p.lock} · ${p.price}원. 범일금고 본사 정품을 영등포에서 직접 설치해 드립니다.`,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) notFound();

  const related = PRODUCTS.filter(
    (x) => x.cat === p.cat && x.id !== p.id,
  ).slice(0, 4);

  return (
    <>
      <Container className="py-8">
        <Link href="/products" className="text-[14px] text-blue hover:underline">
          ← 전체 금고로
        </Link>
      </Container>

      <section className="bg-canvas">
        <Container className="grid gap-12 pb-16 md:grid-cols-2">
          {/* 이미지 — 파치먼트 면 위 제품 그림자 */}
          <div className="relative flex items-center justify-center rounded-lg bg-parchment p-10">
            {p.best && (
              <span className="absolute left-5 top-5 rounded-pill bg-ink px-3 py-1 text-[12px] font-semibold text-white">
                BEST
              </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.img}
              alt={p.name}
              className="w-full max-w-[420px] [filter:drop-shadow(0_5px_30px_rgba(0,0,0,0.22))]"
            />
          </div>

          {/* 정보 */}
          <div className="flex flex-col">
            <p className="text-[14px] text-ink-faint">
              {p.catLabel} · {p.lock}
            </p>
            <h1 className="tracking-tight-apple mt-2 text-[clamp(24px,3.4vw,34px)] font-semibold leading-snug text-ink">
              {p.name}
            </h1>

            <div className="mt-5 flex items-baseline gap-3">
              {p.discount > 0 && (
                <span className="text-[20px] font-bold text-blue">
                  {p.discount}%
                </span>
              )}
              <span className="text-[28px] font-bold text-ink">{p.price}원</span>
              {p.original && (
                <span className="text-[15px] text-ink-faint line-through">
                  {p.original}원
                </span>
              )}
            </div>
            {p.reviews > 0 && (
              <p className="mt-2 text-[14px] text-ink-faint">
                ★ {p.rating} · 리뷰 {p.reviews}개
              </p>
            )}

            <ul className="mt-6 space-y-2 border-t border-hairline pt-6 text-[15px]">
              <Spec label="분류" value={p.catLabel} />
              <Spec label="잠금방식" value={p.lock} />
              <Spec label="공급" value="범일금고 본사 정품" />
              <Spec label="설치" value="영등포 전문 기사 방문 설치" />
            </ul>

            <p className="mt-6 rounded-lg bg-parchment px-4 py-3 text-[13px] text-ink-muted">
              가격·재고는 상담 시 확정됩니다. 설치 환경을 알려주시면 정확히
              안내해 드려요.
            </p>

            <div className="mt-6">
              <ConsultButtons size="lg" showPhoneNumber />
            </div>
          </div>
        </Container>
      </section>

      {/* 구매 후기 */}
      <ReviewSection product={p} />

      {/* 같은 카테고리 추천 */}
      {related.length > 0 && (
        <section className="bg-parchment">
          <Container className="py-16">
            <h2 className="text-[22px] font-semibold text-ink">
              같은 종류의 다른 금고
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.id} product={r} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex gap-4">
      <span className="w-20 shrink-0 text-ink-faint">{label}</span>
      <span className="text-ink">{value}</span>
    </li>
  );
}
