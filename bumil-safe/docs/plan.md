# plan — 어떻게 만들지 (범일금고 Next.js 재구축)

> 이 문서 = **어떻게**(구조·기술·순서). 무엇/왜는 `PRD.md`, 실행 체크리스트는 `../todo.md`.

## 기술 스택

- **Next.js (App Router) + TypeScript** — `create-next-app` 추천 기본값
- **Tailwind CSS** — create-next-app 기본 포함. 기존 골드 팔레트를 토큰으로 이식
- **배포: Vercel** (GitHub 연결 → 자동 감지)
- 데이터: 정적 (제품 40종을 TS 데이터 파일로). 백엔드/DB 없음

## 프로젝트 구조 (강의의 "딱 3곳" + 데이터)

```
bumil-safe/
├─ app/                 # 페이지 (라우트)
│  ├─ layout.tsx        # 공통 레이아웃(Header·Footer·배너)
│  ├─ page.tsx          # 홈 /
│  ├─ products/page.tsx # 제품 목록 /products
│  ├─ products/[id]/page.tsx # 제품 상세 /products/[id] (개별 페이지)
│  ├─ about/page.tsx    # 회사소개 /about
│  ├─ service/page.tsx  # 서비스 /service
│  └─ contact/page.tsx  # 상담·오시는길 /contact
├─ components/          # 재사용 컴포넌트
│  ├─ Header.tsx  Footer.tsx  TopBanner.tsx
│  ├─ ConsultButtons.tsx (카톡/전화)
│  ├─ ProductCard.tsx  ProductGrid.tsx  (모달 없음 → 상세는 라우트)
│  ├─ TrustItem.tsx  SectionHead.tsx  Marquee.tsx
├─ lib/
│  ├─ products.ts       # 제품 40종 데이터 (기존 products.js 이식)
│  └─ site.ts           # 매장정보·전화·카카오 URL (기존 config.js 대응)
├─ public/              # 이미지·정적 파일
├─ docs/  (PRD.md · plan.md · DESIGN.md(선택))
├─ todo.md
└─ CLAUDE.md            # /init 로 생성·확장
```

## 컴포넌트 의존성 = 빌드 순서 (직렬 먼저 → 페이지)

강사 기준: **공유(의존성 있는 것) 먼저 직렬, 독립 페이지는 그 다음.**

1. **디자인 토큰 먼저** (벽): Tailwind 설정에 골드 팔레트·폰트·radius 이식 → `DESIGN.md`(선택)
2. **공유 컴포넌트 고정** (의존성): Header · Footer · TopBanner · ConsultButtons · SectionHead
   - `/styleguide`(또는 임시 페이지)로 한 화면에 모아 모바일/데스크톱 확인·승인
3. **데이터 이식**: `js/products.js` → `lib/products.ts` (타입 부여), `config.js` → `lib/site.ts`
4. **제품 컴포넌트**: ProductCard → ProductGrid (상세는 페이지로)
5. **페이지 빌드** (공유 부품 import 전제):
   - 홈 `/` (가장 많은 섹션 → 컴포넌트 재사용 검증)
   - 제품 목록 `/products` → 제품 상세 `/products/[id]` (동적 라우트)
   - 회사소개 `/about`
   - 서비스 `/service`
   - 상담 `/contact`
6. **반응형·다듬기**: 컴포넌트 단위로 모바일 대응, 카피·접근성(시맨틱 태그)
7. **배포**: GitHub 푸시 → Vercel Import

## 직렬 vs 병렬 판단

- 공유 컴포넌트·토큰 = **직렬**(반드시 먼저, 안 그러면 페이지마다 헤더가 갈림)
- about·service·contact = 서로 독립 → 익숙해지면 병렬 가능. **이번엔 직렬 권장**(입문·맥락 유지·디버깅 쉬움)

## 데이터 이식 메모

- `PRODUCTS` 배열의 필드(id·cat·catLabel·lock·name·price·original·discount·reviews·rating·best·img) → `Product` 타입으로
- 카테고리: `smart`(디자인) · `finger`(지문인식) · `basic`(가정·사무용) + 가상 탭 `all`·`best`
- 정렬 로직(인기·최신·가격·할인·리뷰·평점) 재구현
- 이미지: 외부 `shop-phinf.pstatic.net` URL 그대로 사용 (`next.config`에 도메인 허용 또는 `<img>` 사용)

## CLAUDE.md에 넣을 규칙(초안)

- 작업 전 `todo.md` 읽고 맨 위 미완료부터, 끝나면 `[x]` 체크하며 커밋
- 색·폰트·간격은 Tailwind 토큰만 사용(임의 hex 금지)
- 모든 페이지 CTA는 ConsultButtons로 통일
- 가격/재고는 "상담 시 확정" — 결제 동선 만들지 말 것

## 검증 방법

- `npm run dev` 로컬 + Playwright로 모바일/데스크톱 스크린샷
- 페이지 이동·상담 버튼·지도 링크 동작 확인
- `/code-review`로 변경 검토
