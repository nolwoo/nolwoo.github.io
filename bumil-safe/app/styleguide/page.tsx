import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { ConsultButtons } from "@/components/ConsultButtons";
import { SectionHead } from "@/components/SectionHead";

export const metadata = { title: "스타일가이드" };

const SWATCHES = [
  { name: "Action Blue", varName: "--color-blue", hex: "#0066cc" },
  { name: "Ink", varName: "--color-ink", hex: "#1d1d1f" },
  { name: "Ink Muted", varName: "--color-ink-muted", hex: "#333333" },
  { name: "Ink Faint", varName: "--color-ink-faint", hex: "#7a7a7a" },
  { name: "Parchment", varName: "--color-parchment", hex: "#f5f5f7" },
  { name: "Pearl", varName: "--color-pearl", hex: "#fafafc" },
  { name: "Tile (dark)", varName: "--color-tile", hex: "#272729" },
  { name: "Hairline", varName: "--color-hairline", hex: "#e0e0e0" },
  { name: "Kakao", varName: "--color-kakao", hex: "#fee500" },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline py-14">
      <Container>
        <p className="mb-8 text-[14px] font-semibold uppercase tracking-wider text-ink-faint">
          {title}
        </p>
        {children}
      </Container>
    </section>
  );
}

export default function StyleGuide() {
  // 개발(로컬)에서만 노출 — 배포(프로덕션)에선 404
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <>
      <Container className="py-14">
        <SectionHead
          eyebrow="Style Guide"
          title="범일금고 디자인 시스템"
          lead="Apple 디자인 언어를 이식한 공통 토큰·컴포넌트 쇼룸. 페이지를 짓기 전에 부품을 먼저 확인합니다."
        />
      </Container>

      {/* 색 */}
      <Block title="색 (Color)">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {SWATCHES.map((s) => (
            <div key={s.name} className="overflow-hidden rounded-lg border border-hairline">
              <div className="h-20" style={{ background: `var(${s.varName})` }} />
              <div className="p-3">
                <p className="text-[14px] font-semibold text-ink">{s.name}</p>
                <p className="text-[12px] text-ink-faint">{s.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </Block>

      {/* 타이포 */}
      <Block title="타이포그래피 (Typography)">
        <div className="space-y-4">
          <p className="tracking-tight-apple text-[56px] font-semibold leading-[1.07]">
            Hero Display · 56 / 600
          </p>
          <p className="tracking-tight-apple text-[40px] font-semibold leading-[1.1]">
            Display · 40 / 600
          </p>
          <p className="text-[28px] leading-[1.14]">Lead · 28 / 400</p>
          <p className="text-[21px] font-semibold leading-snug">Tagline · 21 / 600</p>
          <p className="text-[17px] leading-[1.47]">
            Body · 17 / 400 — 범일금고 본사 정품을 영등포에서 직접 설치해 드립니다.
            가정부터 사무실까지, 꼭 맞는 금고를 상담해 드립니다.
          </p>
          <p className="text-[14px] text-ink-muted">Caption · 14 / 400 — 가격은 상담 시 확정됩니다.</p>
        </div>
      </Block>

      {/* 버튼 */}
      <Block title="버튼 (Buttons)">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary 알약</Button>
          <Button variant="ghost">Ghost 알약</Button>
          <Button variant="dark" size="sm">Dark Utility</Button>
          <Button variant="kakao">💬 카카오</Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </Block>

      {/* 상담 버튼 (전환) */}
      <Block title="상담 버튼 — 전환 CTA (ConsultButtons)">
        <p className="mb-4 text-[15px] text-ink-muted">
          모든 페이지의 주 CTA. 카톡 채널 미설정 시 클릭하면 전화 안내가 뜹니다.
        </p>
        <ConsultButtons size="lg" showPhoneNumber />
      </Block>

      {/* 밝은/어두운 타일 교차 (Apple 시그니처) */}
      <section className="bg-canvas py-20">
        <Container className="text-center">
          <SectionHead
            center
            title="밝은 타일 (Light Tile)"
            lead="흰 캔버스 — 색의 전환 자체가 섹션 구분선이 됩니다."
          />
        </Container>
      </section>
      <section className="bg-parchment py-20">
        <Container className="text-center">
          <SectionHead
            center
            title="파치먼트 타일 (Parchment)"
            lead="시그니처 오프화이트 #f5f5f7 — 흰 타일이 연속될 때 리듬을 줍니다."
          />
        </Container>
      </section>
      <section className="bg-tile py-20">
        <Container className="text-center">
          <SectionHead
            center
            dark
            title="다크 타일 (Dark Tile)"
            lead="근검정 #272729 위 흰 텍스트. 인라인 링크는 스카이 블루."
          />
          <div className="mt-8 flex justify-center">
            <ConsultButtons size="md" />
          </div>
        </Container>
      </section>
    </>
  );
}
