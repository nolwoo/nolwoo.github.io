import { Container } from "@/components/Container";
import { SectionHead } from "@/components/SectionHead";
import { ConsultButtons } from "@/components/ConsultButtons";

export const metadata = {
  title: "서비스 · 설치 · A/S",
  description:
    "상담부터 방문 설치, 구매 후 A/S까지. 범일금고 영등포대리점의 설치·사후관리 과정을 안내합니다.",
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
    desc: "전문 기사가 직접 방문해 안전하게 시공하고, 사용법을 안내해 드립니다.",
  },
  {
    no: "04",
    title: "사후관리",
    desc: "비밀번호·작동 문제도 걱정 마세요. 구매 이후에도 A/S 상담으로 챙깁니다.",
  },
];

const FAQ = [
  {
    q: "설치 가능 지역은 어디인가요?",
    a: "영등포 인근을 중심으로 방문 설치해 드립니다. 지역은 상담 시 확인해 드려요.",
  },
  {
    q: "설치 비용은 따로 드나요?",
    a: "제품·설치 환경에 따라 다릅니다. 환경을 알려주시면 정확히 안내해 드립니다.",
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

export default function ServicePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-canvas">
        <Container size="narrow" className="py-24 text-center">
          <SectionHead
            center
            eyebrow="서비스"
            title={<>상담부터 설치, 사후관리까지<br />한 번에 챙겨드립니다.</>}
            lead="금고는 사는 것보다 '제대로 설치하고 오래 쓰는 것'이 중요합니다."
          />
        </Container>
      </section>

      {/* 4단계 흐름 — 파치먼트 */}
      <section className="bg-parchment">
        <Container className="py-24">
          <div className="grid gap-10 md:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.no}>
                <span className="text-[15px] font-semibold text-blue">{s.no}</span>
                <h3 className="mt-3 text-[21px] font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
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
                <h4 className="text-[17px] font-semibold text-ink">Q. {f.q}</h4>
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
            설치 환경만 알려주시면 딱 맞는 금고와 설치 방법을 안내해 드려요.
          </p>
          <div className="mt-8 flex justify-center">
            <ConsultButtons size="lg" showPhoneNumber className="justify-center" />
          </div>
        </Container>
      </section>
    </>
  );
}
