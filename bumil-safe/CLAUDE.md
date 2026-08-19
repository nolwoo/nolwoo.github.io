@AGENTS.md

# 범일금고 영등포대리점 — 프로젝트 가이드

부트니스 7주차 실습. 기존 바닐라 사이트를 Next.js 다중페이지 사업체 사이트로 재구축한다.
- **무엇·왜:** `docs/PRD.md`  ·  **어떻게:** `docs/plan.md`  ·  **순서:** `todo.md`

## 작업 방식
- 작업 전 `todo.md`를 읽고 **맨 위 미완료 항목부터**. 끝나면 `[x]` 체크하고 함께 커밋한다.
- 긴 문서는 통째로 읽지 말고 관련 섹션만. (PRD=무엇·왜 / plan=어떻게 / todo=순서)
- 한 덩이 끝나면 커밋·푸시 (안전 저장 + 되돌리기 지점).

## ⚠️ Next.js 16 주의
- 이 프로젝트는 Next.js 16 — 학습 데이터와 다른 변경점이 많다. 코드 작성 전 `node_modules/next/dist/docs/` 의 관련 가이드를 먼저 확인한다. (`@AGENTS.md` 경고 참조)
- App Router, TypeScript, Tailwind v4 사용.

## 디자인 규칙
- 색·폰트·간격은 **Tailwind 토큰만** 사용한다. 임의 hex 직접 입력 금지.
- 디자인 토큰은 `app/globals.css`의 `:root` + `@theme`에 정의 (Tailwind v4 방식).
- **흑백 모노톤** (2026-08-08부터 최종 확정 — `mono-design-system.md` 기준): 컬러 액센트 없이
  명도 차이로만 위계를 준다. `--blue` 토큰도 잉크(`#141414`)로 통일돼 있고, 모서리도 전역
  각짐(`radius: 0`)이다. 카카오 아이콘(`#FEE500`)만 기능색 예외로 유지.
  세리프·골드 등 별도 장식 액센트는 쓰지 않는다 — 사진/제품이 주인공, UI는 최대한 조용하게.
  (이전엔 Action Blue `#0066cc` + 둥근 pill이었으나, 2026-08-18 로컬 A/B 비교 후 모노톤으로 확정)
- 폰트: **Pretendard**(SF Pro 대응) 산세리프 단일 패밀리 — 헤드라인 포함 세리프 사용 금지.
- 톤: 프리미엄·신뢰·차분 (금고 = 안전·고급).

## 도메인 규칙 (중요)
- **전환은 "상담" 한 곳으로 수렴**: 카카오톡 상담 + 전화 `02-2632-6070`.
- **온라인 결제·장바구니·회원 만들지 말 것.** 가격·재고는 "상담 시 확정" (한국 금고 유통 관행).
- 모든 페이지의 주 CTA는 공통 `ConsultButtons` 컴포넌트로 통일.
- 메시지 기둥 3가지: **본사 정품 · 전문 설치 · 구매 후 A/S**.
- 매장: 서울 영등포구 영등포로 164 · 평일 09:00–18:00.

## 상담 접수 (2026-08-19부터 전화·카카오톡만)
- 온라인 상담폼 + Supabase 저장 + `/admin` 접수 목록 기능은 **전면 제거**했다 (구현했었으나 되돌림).
- `/contact`는 이제 `ConsultButtons`(카카오톡·전화)로만 안내한다. 폼·DB·관리자 페이지 없음.
- 관련 파일(`lib/supabase.ts`·`lib/auth.ts`·`lib/notify.ts`·`lib/rate-limit.ts`·`components/InquiryForm.tsx`·
  `components/AdminLogin.tsx`·`app/admin/`·`app/api/inquiry/`·`app/api/admin-login/`)은 삭제됨.
  되살리려면 git 히스토리에서 복구.

## 구조 (자세히는 docs/plan.md)
- `app/` 페이지(라우트) · `components/` 재사용 부품 · `lib/` 데이터(products·site) · `public/` 정적파일.
- 제품 상세는 **모달 아님 → 동적 라우트** `app/products/[id]/page.tsx` (검색·링크 공유 위해 메타데이터 설정).
- 제품 데이터 40종은 기존 사이트 `js/products.js`에서 이식 (`/Users/yj/stock report/bumil-safe/`).
