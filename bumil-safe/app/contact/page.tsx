import { Container } from "@/components/Container";
import { SectionHead } from "@/components/SectionHead";
import { ConsultButtons } from "@/components/ConsultButtons";
import { InquiryForm } from "@/components/InquiryForm";

export const metadata = {
  title: "상담",
  description:
    "영등포 금고 상담을 신청하세요. 설치 환경만 알려주시면 맞는 금고를 추천해 드립니다. 전화·카카오톡 상담도 가능합니다.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      {/* Hero + 상담 */}
      <section className="bg-canvas">
        <Container size="narrow" className="py-24 text-center">
          <SectionHead
            as="h1"
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

      {/* 온라인 상담 신청 폼 — 밝은, 사진+폼 */}
      <section className="bg-canvas pb-20">
        <Container className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <div className="overflow-hidden rounded-lg">
              <img
                src="/service-home.webp"
                alt="범일금고 월넛우드패널 스마트 금고"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <ul className="mt-8 space-y-3 text-[15px] text-ink-muted">
              <li>✓ 본사 정품만 취급합니다</li>
              <li>✓ 전문 기사가 직접 방문해 설치합니다</li>
              <li>✓ 구매 후에도 A/S로 곁에서 챙깁니다</li>
            </ul>
          </div>
          <div>
            <InquiryForm />
            <p className="mt-3 text-center text-[13px] text-ink-faint">
              남겨주신 내용은 안전하게 보관되며, 상담 목적으로만 사용됩니다.
            </p>
            <p className="mt-6 text-center text-[14px] text-ink-muted">
              매장에 직접 방문하고 싶으세요?{" "}
              <a href="/location" className="font-medium text-blue hover:underline">
                오시는길 보기 →
              </a>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
