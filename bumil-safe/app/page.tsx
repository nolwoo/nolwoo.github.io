import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionHead } from "@/components/SectionHead";
import { ConsultButtons } from "@/components/ConsultButtons";
import { TrustItem } from "@/components/TrustItem";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/Button";
import { HeroCarousel } from "@/components/HeroCarousel";
import { getPopular } from "@/lib/catalog";

export default function Home() {
  const popular = getPopular(8);

  return (
    <>
      {/* ① Hero — 실제 제품 사진 5장이 자동으로 넘어가는 캐러셀 */}
      <section className="bg-canvas">
        <Container className="pt-14 pb-20 md:pt-20">
          {/* 페이지 대표 제목(h1) — 검색엔진이 주제를 판단하는 핵심 신호라 지역·업종을 명시 */}
          <h1 className="text-center text-[13px] font-semibold uppercase tracking-[0.3em] text-blue">
            Bumil Safe · 영등포 금고 전문점
          </h1>
          <div className="mt-6">
            <HeroCarousel />
          </div>
        </Container>
      </section>

      {/* ② 인기 제품 — 밝은 타일 */}
      <section className="bg-canvas pb-24">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <SectionHead
              eyebrow="제품"
              title="바로 만나보는 인기 금고"
              lead="범일금고 본사 정품 · 영등포 직접 설치 · 가격은 상담 시 확정됩니다."
            />
            <Link
              href="/products"
              className="hidden shrink-0 text-[15px] font-medium text-blue hover:underline sm:block"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {popular.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/products" variant="primary" size="lg">
              금고 전체 보기 (40종) →
            </Button>
          </div>
        </Container>
      </section>

      {/* ③ 철학 — 다크 타일, 사진+텍스트 스플릿 */}
      <section className="bg-tile">
        <Container className="py-20 md:py-28">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div className="overflow-hidden rounded-lg">
              <img
                src="/philosophy-moire.webp"
                alt="범일금고 MOIRE 모아르 스마트 금고"
                className="aspect-[4/5] w-full object-cover sm:aspect-[16/11] md:aspect-[4/5]"
              />
            </div>
            <div>
              <p className="text-[clamp(22px,3vw,30px)] font-medium leading-[1.55] text-on-dark">
                우리는 오래도록 <span className="text-blue-on-dark">‘무엇을 지킬 것인가’</span>를
                고민해 왔습니다. 좋은 금고란 단단한 철문을 넘어, 매일의 안심을 곁에 두는
                일이라 믿어요.
              </p>
              <p className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-on-dark-muted">
                현금과 귀중품, 중요한 서류와 추억까지 — 지켜야 할 것이 분명한 사람들을
                위해, 범일금고는 곁을 지킵니다.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ④ 세 가지 기준 — 파치먼트 타일 */}
      <section className="bg-parchment">
        <Container className="py-24">
          <SectionHead
            eyebrow="기준"
            title={
              <>
                정품 · 설치 · 사후관리,
                <br />세 가지 기준을 지킵니다.
              </>
            }
            lead="본사에서 직접 공급받은 정품만, 전문 기사가 직접 설치하고, 구매 후에도 곁에서 챙깁니다."
          />
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <TrustItem
              no="01"
              title="본사 정품 직공급"
              desc="범일금고 본사에서 직접 받은 정품만, 합리적인 가격에 공급합니다."
            />
            <TrustItem
              no="02"
              title="전문 기사 설치"
              desc="무거운 금고도 안전하게. 설치 환경을 확인하고 직접 방문해 시공합니다."
            />
            <TrustItem
              no="03"
              title="구매 후 A/S 상담"
              desc="비밀번호·작동 문제도 걱정 마세요. 구매 이후에도 곁에서 챙깁니다."
            />
          </div>
        </Container>
      </section>

      {/* ⑤ 서비스 미리보기 — 밝은 타일 */}
      <section className="bg-canvas">
        <Container className="py-24">
          <SectionHead
            eyebrow="서비스"
            title={<>당신의 하루에 꼭 맞는 금고를<br />함께 찾아드려요.</>}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <ServiceCard
              img="/service-home.webp"
              tag="가정용 금고"
              desc="현금·귀중품·서류를 안전하게. 인테리어를 해치지 않는 디자인 금고부터 지문인식까지."
              href="/products"
            />
            <ServiceCard
              img="/service-office.webp"
              tag="사무용 금고"
              desc="사무실·매장의 자산을 든든하게. 대형·이중잠금·스마트 모델까지 폭넓게 갖췄어요."
              href="/products"
            />
          </div>
          <div className="mt-10 text-center">
            <Link href="/service" className="text-[15px] font-medium text-blue hover:underline">
              설치·A/S 과정 자세히 보기 →
            </Link>
          </div>
        </Container>
      </section>

      {/* ⑥ 마무리 CTA — 파치먼트 */}
      <section className="bg-parchment">
        <Container className="py-24 text-center">
          <h2 className="text-[clamp(27px,4.2vw,42px)] font-semibold leading-[1.25]">
            오늘, 가장 안전한 선택을 시작하세요.
          </h2>
          <p className="mx-auto mt-4 max-w-[40ch] text-[18px] text-ink-muted">
            설치 환경만 알려주시면 딱 맞는 금고를 추천해 드려요. 부담 없이 문의하세요.
          </p>
          <div className="mt-8 flex justify-center">
            <ConsultButtons size="lg" showPhoneNumber className="justify-center" />
          </div>
        </Container>
      </section>
    </>
  );
}

function ServiceCard({
  img,
  tag,
  desc,
  href,
}: {
  img: string;
  tag: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-lg border border-hairline bg-canvas transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={img}
          alt={tag}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-8">
        <h3 className="text-[21px] font-semibold text-ink">{tag}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{desc}</p>
        <span className="mt-5 inline-block text-[15px] font-medium text-blue group-hover:underline">
          제품 보기 →
        </span>
      </div>
    </Link>
  );
}
