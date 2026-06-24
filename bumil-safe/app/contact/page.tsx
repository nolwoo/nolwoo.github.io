import { Container } from "@/components/Container";
import { SectionHead } from "@/components/SectionHead";
import { ConsultButtons } from "@/components/ConsultButtons";
import { Button } from "@/components/Button";
import { InquiryForm } from "@/components/InquiryForm";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "상담 · 오시는길",
  description:
    "범일금고 영등포대리점 상담 안내. 전화·카카오톡 상담, 매장 위치와 영업시간을 확인하세요.",
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
            <ConsultButtons size="lg" showPhoneNumber />
          </div>
        </Container>
      </section>

      {/* 온라인 상담 신청 폼 — 밝은 */}
      <section className="bg-canvas pb-8">
        <Container size="narrow">
          <InquiryForm />
          <p className="mt-3 text-center text-[13px] text-ink-faint">
            남겨주신 내용은 안전하게 보관되며, 상담 목적으로만 사용됩니다.
          </p>
        </Container>
      </section>

      {/* 매장 정보 + 지도 — 파치먼트 */}
      <section className="bg-parchment">
        <Container className="py-20">
          <div className="grid gap-8 md:grid-cols-2">
            {/* 정보 */}
            <div className="rounded-lg border border-hairline bg-canvas p-8">
              <h3 className="text-[22px] font-semibold text-ink">
                범일금고 <span className="text-ink-faint">영등포대리점</span>
              </h3>
              <ul className="mt-6 space-y-4 text-[15px]">
                <Row label="도로명" value={SITE.address.road} />
                <Row label="지번" value={SITE.address.jibun} />
                <Row
                  label="전화"
                  value={
                    <a href={SITE.phoneHref} className="font-semibold text-blue">
                      {SITE.phone}
                    </a>
                  }
                />
                <Row label="영업시간" value={SITE.address.hours} />
              </ul>
            </div>

            {/* 지도 링크 */}
            <div className="flex flex-col justify-center rounded-lg border border-hairline bg-canvas p-8">
              <p className="text-[40px]">📍</p>
              <p className="mt-3 text-[17px] font-semibold text-ink">
                {SITE.address.road}
              </p>
              <p className="mt-1 text-[14px] text-ink-muted">
                지도 앱에서 길찾기를 열 수 있어요.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={SITE.map.naver} variant="primary" target="_blank" rel="noopener">
                  네이버 지도
                </Button>
                <Button href={SITE.map.kakao} variant="dark" target="_blank" rel="noopener">
                  카카오맵
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="w-20 shrink-0 text-ink-faint">{label}</span>
      <span className="text-ink">{value}</span>
    </li>
  );
}
