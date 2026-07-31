import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionHead } from "@/components/SectionHead";
import { ConsultButtons } from "@/components/ConsultButtons";
import { TrustItem } from "@/components/TrustItem";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/Button";
import { getPopular } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export default function Home() {
  const popular = getPopular(8);

  return (
    <>
      {/* ① Hero — 다크 타일 */}
      <section className="bg-tile">
        <Container className="py-24 text-center md:py-32">
          <p className="text-[13px] font-semibold uppercase tracking-[0.3em] text-blue-on-dark">
            Bumil Safe · {SITE.branch}
          </p>
          <h1 className="mx-auto mt-5 max-w-[14ch] text-[clamp(38px,6.4vw,62px)] font-semibold leading-[1.22] text-on-dark">
            소중한 것을<br />가장 안전하게
          </h1>
          <p className="mx-auto mt-7 max-w-[44ch] text-[clamp(17px,2.2vw,21px)] leading-relaxed text-on-dark-muted">
            범일금고 본사 정품을 영등포에서. 가정부터 사무실까지, 꼭 맞는 금고를
            상담해 드립니다.
          </p>
          <div className="mt-10 flex justify-center">
            <ConsultButtons size="lg" showPhoneNumber onDark className="justify-center" />
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

      {/* ③ 철학 문장 — 다크 타일 */}
      <section className="bg-tile">
        <Container size="narrow" className="py-28 text-center">
          <p className="text-[clamp(23px,3.4vw,34px)] font-medium leading-[1.55] text-on-dark">
            우리는 오래도록 <span className="text-blue-on-dark">‘무엇을 지킬 것인가’</span>를
            고민해 왔습니다. 좋은 금고란 단단한 철문을 넘어, 매일의 안심을 곁에 두는
            일이라 믿어요.
          </p>
          <p className="mx-auto mt-6 max-w-[52ch] text-[17px] leading-relaxed text-on-dark-muted">
            현금과 귀중품, 중요한 서류와 추억까지 — 지켜야 할 것이 분명한 사람들을
            위해, 범일금고는 곁을 지킵니다.
          </p>
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
              tag="가정용 금고"
              desc="현금·귀중품·서류를 안전하게. 인테리어를 해치지 않는 디자인 금고부터 지문인식까지."
              href="/products"
            />
            <ServiceCard
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
  tag,
  desc,
  href,
}: {
  tag: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-hairline bg-canvas p-8 transition-transform duration-200 hover:-translate-y-1"
    >
      <h3 className="text-[21px] font-semibold text-ink">{tag}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{desc}</p>
      <span className="mt-5 inline-block text-[15px] font-medium text-blue group-hover:underline">
        제품 보기 →
      </span>
    </Link>
  );
}
