import { Container } from "@/components/Container";
import { SectionHead } from "@/components/SectionHead";
import { ConsultButtons } from "@/components/ConsultButtons";
import { InquiryForm } from "@/components/InquiryForm";

export const metadata = {
  title: "상담",
  description:
    "범일금고 영등포대리점 온라인 상담 신청. 전화·카카오톡 상담도 가능합니다.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero + 상담 */}
      <section className="bg-canvas">
        <Container size="narrow" className="py-24 text-center">
          <SectionHead
            center
            eyebrow="상담"
            title="부담 없이 문의하세요"
            lead="설치 환경(어디에·무엇을 보관)만 알려주시면 딱 맞는 금고를 추천해 드려요."
          />
          <div className="mt-9 flex justify-center">
            <ConsultButtons size="lg" showPhoneNumber className="justify-center" />
          </div>
        </Container>
      </section>

      {/* 온라인 상담 신청 폼 — 밝은 */}
      <section className="bg-canvas pb-20">
        <Container size="narrow">
          <InquiryForm />
          <p className="mt-3 text-center text-[13px] text-ink-faint">
            남겨주신 내용은 안전하게 보관되며, 상담 목적으로만 사용됩니다.
          </p>
          <p className="mt-6 text-center text-[14px] text-ink-muted">
            매장에 직접 방문하고 싶으세요?{" "}
            <a href="/location" className="font-medium text-gold-deep hover:underline">
              오시는길 보기 →
            </a>
          </p>
        </Container>
      </section>
    </>
  );
}
