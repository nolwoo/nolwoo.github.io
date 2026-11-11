import { Container } from "@/components/Container";
import { SectionHead } from "@/components/SectionHead";
import { ConsultButtons } from "@/components/ConsultButtons";

export const metadata = {
  title: "서비스 · 설치 · A/S",
  description:
    "서울·경기 전 지역 방문 설치와 1년 무상 A/S. 영등포 금고 대리점이 상담부터 설치, 사후관리까지 어떻게 진행하는지 안내합니다.",
  alternates: { canonical: "/service" },
};

const STEPS = [
  {
    no: "01",
    title: "상담",
    desc: "전화·카카오톡으로 설치 환경과 용도를 알려주세요. 딱 맞는 금고를 추천해 드립니다.",
  },
  {
    no: "02",
    title: "환경 확인",
    desc: "설치 위치·바닥·동선을 확인합니다. 필요하면 방문해 직접 점검합니다.",
  },
  {
    no: "03",
    title: "전문 설치",
    desc: "주문 후 보통 1주일 내외로 전문 기사가 직접 방문해 안전하게 시공하고, 사용법을 안내해 드립니다.",
  },
  {
    no: "04",
    title: "사후관리",
    desc: "무상 A/S는 1년이고 방문 수리도 가능합니다. 비밀번호·작동 문제도 걱정 마세요.",
  },
];

const FAQ = [
  {
    q: "설치 가능 지역은 어디인가요?",
    a: "서울·경기 전 지역에 전문 기사가 직접 방문해 설치합니다. 설치할 주소를 알려주시면 방문 일정을 안내해 드려요.",
  },
  {
    q: "설치 비용은 얼마인가요?",
    a: "설치 지역, 층수, 제품, 승강기 유무에 따라 달라집니다. 설치할 주소와 제품을 알려주시면 정확한 비용을 안내해 드립니다.",
  },
  {
    q: "주문하면 설치까지 얼마나 걸리나요?",
    a: "주문 후 설치까지 보통 1주일 내외입니다. 정확한 일정은 상담 때 안내해 드려요.",
  },
  {
    q: "A/S는 어떻게 되나요?",
    a: "무상 A/S 기간은 1년이고, 방문 수리도 가능합니다. 구매 이후에도 A/S 상담으로 챙깁니다.",
  },
  {
    q: "이미 설치한 금고를 다른 곳으로 옮길 수도 있나요?",
    a: "네, 이전 설치도 가능합니다. 현재 위치와 옮길 위치를 알려주시면 비용과 일정을 안내해 드려요.",
  },
  {
    q: "가정용과 사무용, 뭐가 다른가요?",
    a: "용도·크기·잠금방식이 다릅니다. 보관할 물건과 공간을 알려주시면 맞춰 추천합니다.",
  },
  {
    q: "구매 후 비밀번호를 잊어버리면요?",
    a: "당황하지 마세요. A/S 상담으로 도와드립니다. 구매 이후에도 곁에서 챙깁니다.",
  },
];

// FAQ 구조화 데이터 — 구글 검색결과에 질문·답변이 아코디언으로 노출될 수 있음
const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function ServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      {/* Hero */}
      <section className="bg-canvas">
        <Container size="narrow" className="py-24 text-center">
          <SectionHead
            as="h1"
            center
            eyebrow="서비스"
            title={<>상담부터 설치,<br />사후관리까지 한 번에 챙겨드립니다.</>}
            lead="금고는 사는 것보다 '제대로 설치하고 오래 쓰는 것'이 중요합니다."
          />
        </Container>
      </section>

      {/* 4단계 흐름 — 파치먼트, 줄 단위 리스트(에디토리얼) */}
      <section className="bg-parchment">
        <Container size="narrow" className="py-24">
          <SectionHead eyebrow="프로세스" title="설치는 이렇게 진행됩니다" />
          <div className="mt-10 divide-y divide-hairline border-y border-hairline">
            {STEPS.map((s) => (
              <div
                key={s.no}
                className="grid gap-2 py-8 sm:grid-cols-[64px_180px_1fr] sm:items-baseline sm:gap-8"
              >
                <span className="text-[15px] font-semibold text-blue">
                  ({s.no})
                </span>
                <h3 className="text-[19px] font-semibold text-ink">{s.title}</h3>
                <p className="text-[15px] leading-relaxed text-ink-muted">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ — 밝은 */}
      <section className="bg-canvas">
        <Container size="narrow" className="py-24">
          <SectionHead eyebrow="자주 묻는 질문" title="궁금한 점을 모았어요" />
          <div className="mt-10 divide-y divide-hairline border-y border-hairline">
            {FAQ.map((f) => (
              <div key={f.q} className="py-6">
                <h3 className="text-[17px] font-semibold text-ink">Q. {f.q}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA — 다크 타일 */}
      <section className="bg-tile">
        <Container className="py-20 text-center">
          <h2 className="tracking-tight-apple text-[clamp(25px,3.8vw,36px)] font-semibold text-on-dark">
            궁금한 건 편하게 물어보세요.
          </h2>
          <p className="mx-auto mt-4 max-w-[40ch] text-[17px] text-on-dark-muted">
            설치 환경만 알려주시면
            <br />
            딱 맞는 금고와 설치 방법을 안내해 드려요.
          </p>
          <div className="mt-8 flex justify-center">
            <ConsultButtons size="lg" showPhoneNumber onDark className="justify-center" />
          </div>
        </Container>
      </section>
    </>
  );
}
