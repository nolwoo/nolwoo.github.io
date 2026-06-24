import { Container } from "@/components/Container";
import { SectionHead } from "@/components/SectionHead";
import { ProductBrowser } from "@/components/ProductBrowser";
import { ConsultButtons } from "@/components/ConsultButtons";

export const metadata = {
  title: "전체 금고 보기",
  description:
    "범일금고 영등포대리점 전체 금고 목록. 디자인금고·지문인식금고·가정용·사무용 금고를 할인가로 만나보세요.",
};

export default function ProductsPage() {
  return (
    <>
      <section className="bg-canvas">
        <Container className="py-14">
          <SectionHead
            eyebrow="제품"
            title="전체 금고 보기"
            lead="설치 환경만 알려주시면 딱 맞는 금고를 추천해 드려요."
          />
        </Container>
      </section>

      <section className="bg-canvas pb-20">
        <Container>
          <ProductBrowser />
        </Container>
      </section>

      {/* 하단 상담 띠 — 파치먼트 */}
      <section className="bg-parchment">
        <Container className="flex flex-col items-center justify-between gap-6 py-16 text-center md:flex-row md:text-left">
          <div>
            <h3 className="text-[24px] font-semibold text-ink">
              어떤 금고가 맞을지 고민되시나요?
            </h3>
            <p className="mt-2 text-[16px] text-ink-muted">
              설치 환경만 알려주시면 딱 맞는 금고를 추천해 드려요. 부담 없이 문의하세요.
            </p>
          </div>
          <ConsultButtons size="lg" showPhoneNumber />
        </Container>
      </section>
    </>
  );
}
