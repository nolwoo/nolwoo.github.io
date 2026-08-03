import { Container } from "@/components/Container";
import { SectionHead } from "@/components/SectionHead";
import { ConsultButtons } from "@/components/ConsultButtons";
import { Button } from "@/components/Button";
import { KakaoMap } from "@/components/KakaoMap";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "오시는길",
  description: `영등포 금고 매장 오시는 길 안내. ${SITE.address.road}, ${SITE.address.hours}.`,
  alternates: { canonical: "/location" },
};

export default function LocationPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-canvas">
        <Container size="narrow" className="pt-20 pb-10 text-center">
          <SectionHead
            as="h1"
            center
            eyebrow="오시는길"
            title="매장으로 찾아오세요"
            lead="영등포 매장에서 실물을 보고 상담하실 수 있어요. 방문 전 전화 주시면 더 빠르게 도와드려요."
          />
        </Container>
      </section>

      {/* 약도 — 카카오 지도 */}
      <section className="bg-canvas">
        <Container className="pb-14">
          <div className="overflow-hidden rounded-lg border border-hairline">
            <KakaoMap />
          </div>
        </Container>
      </section>

      {/* 매장 정보 + 길찾기 */}
      <section className="bg-parchment">
        <Container className="py-16">
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

            {/* 길찾기 */}
            <div className="flex flex-col justify-center rounded-lg border border-hairline bg-canvas p-8">
              <p className="text-[17px] font-semibold text-ink">길찾기 열기</p>
              <p className="mt-1 text-[14px] text-ink-muted">
                지도 앱에서 현재 위치부터 길찾기를 시작할 수 있어요.
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

      {/* 상담 유도 */}
      <section className="bg-canvas">
        <Container size="narrow" className="py-20 text-center">
          <SectionHead
            center
            title="멀어서 방문이 어려우세요?"
            lead="전화·카카오톡으로도 상담해 드려요. 온라인 상담 신청도 가능합니다."
          />
          <div className="mt-9 flex justify-center">
            <ConsultButtons size="lg" showPhoneNumber className="justify-center" />
          </div>
          <p className="mt-6 text-[14px]">
            <a href="/contact" className="font-medium text-blue hover:underline">
              온라인 상담 신청하기 →
            </a>
          </p>
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
