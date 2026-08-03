import { Container } from "@/components/Container";
import { SectionHead } from "@/components/SectionHead";
import { ConsultButtons } from "@/components/ConsultButtons";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "회사소개",
  description:
    "본사에서 직접 공급받은 정품만 취급하는 영등포 금고 대리점입니다. 전문 기사 설치와 구매 후 A/S로 곁에서 챙깁니다.",
  alternates: { canonical: "/about" },
};

const STATS = [
  { n: "30년+", l: "범일금고 본사 제조 역사" },
  { n: "40종", l: "취급 금고 라인업" },
  { n: "정품", l: "본사 직공급" },
  { n: "영등포", l: "직접 방문 설치" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero — 밝은 */}
      <section className="bg-canvas">
        <Container size="narrow" className="py-24 text-center">
          <SectionHead
            as="h1"
            center
            eyebrow="회사소개"
            title={<>지켜야 할 것이 분명한 사람들의 곁에서</>}
            lead={`${SITE.brand} ${SITE.branch}은 본사 정품을 영등포에서 직접 설치하고, 구매 후에도 곁에서 챙기는 금고 전문 대리점입니다.`}
          />
        </Container>
      </section>

      {/* 수치 — 다크 타일 */}
      <section className="bg-tile">
        <Container className="py-20">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.l}>
                <p className="tracking-tight-apple text-[clamp(28px,4vw,44px)] font-semibold text-on-dark">
                  {s.n}
                </p>
                <p className="mt-2 text-[14px] text-on-dark-muted">{s.l}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 세 가지 기준 — 사진+텍스트 교차 배치 */}
      <section className="bg-parchment">
        <Container className="pt-24">
          <SectionHead
            eyebrow="기준"
            title="우리가 지키는 세 가지"
            lead="화려한 약속보다, 매일의 안심을 만드는 기본을 지킵니다."
          />
        </Container>
      </section>

      <AboutRow
        no="01"
        title="본사 정품 직공급"
        desc="범일금고 본사에서 직접 받은 정품만 취급합니다. 출처가 분명한 제품을 합리적인 가격에 공급합니다."
        img="/hero-product.webp"
        alt="범일금고 OARCFX 스마트 금고 3종"
        bg="bg-parchment"
      />
      <AboutRow
        no="02"
        title="전문 기사 설치"
        desc="수십 킬로그램의 금고도 안전하게. 설치 환경을 먼저 확인하고, 전문 기사가 직접 방문해 시공합니다."
        img="/about-install.webp"
        alt="범일금고 CAVE 스마트 금고"
        bg="bg-canvas"
        reverse
      />
      <AboutRow
        no="03"
        title="구매 후 A/S 상담"
        desc="비밀번호 변경·작동 문제까지. 판매로 끝나지 않고 구매 이후에도 곁에서 챙깁니다."
        img="/about-service.webp"
        alt="범일금고 LUSTER 스마트 금고"
        bg="bg-parchment"
      />

      {/* 매장 한 줄 + CTA — 밝은 */}
      <section className="bg-canvas">
        <Container className="py-24 text-center">
          <h2 className="tracking-tight-apple text-[clamp(25px,3.8vw,36px)] font-semibold leading-[1.3]">
            영등포에서, 직접 보고 상담하세요.
          </h2>
          <p className="mx-auto mt-4 max-w-[44ch] text-[17px] text-ink-muted">
            {SITE.address.road} · {SITE.address.hours}
          </p>
          <div className="mt-8 flex justify-center">
            <ConsultButtons size="lg" showPhoneNumber className="justify-center" />
          </div>
        </Container>
      </section>
    </>
  );
}

function AboutRow({
  no,
  title,
  desc,
  img,
  alt,
  bg,
  reverse = false,
}: {
  no: string;
  title: string;
  desc: string;
  img: string;
  alt: string;
  bg: string;
  reverse?: boolean;
}) {
  return (
    <section className={bg}>
      <Container className="py-16">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className={`overflow-hidden rounded-lg ${reverse ? "md:order-2" : ""}`}>
            <img src={img} alt={alt} className="aspect-[4/3] w-full object-cover" />
          </div>
          <div>
            <span className="text-[15px] font-semibold text-blue">{no}</span>
            <h3 className="mt-3 text-[26px] font-semibold text-ink">{title}</h3>
            <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed text-ink-muted">
              {desc}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
