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
- 팔레트: 포인트 **골드 `--gold #b88a2e`** / 잉크 `#232323` / 다크 `#1a1a1a` / 라인 `#ececec` / 배경 `#fff`·`#faf8f4` / 카카오 `#FEE500`.
- 폰트: **Pretendard**. 톤: 프리미엄·신뢰·차분 (금고 = 안전·고급).

## 도메인 규칙 (중요)
- **전환은 "상담" 한 곳으로 수렴**: 카카오톡 상담 + 전화 `02-2632-6070`.
- **온라인 결제·장바구니·회원 만들지 말 것.** 가격·재고는 "상담 시 확정" (한국 금고 유통 관행).
- 모든 페이지의 주 CTA는 공통 `ConsultButtons` 컴포넌트로 통일.
- 메시지 기둥 3가지: **본사 정품 · 전문 설치 · 구매 후 A/S**.
- 매장: 서울 영등포구 영등포로 164 · 평일 09:00–18:00.

## 상담 접수 기능 (Supabase)
- 구매자: `/contact`의 `InquiryForm` → `POST /api/inquiry` → Supabase `inquiries` 테이블 저장.
- 판매자: `/admin` (비밀번호 게이트, 쿠키 `bumil_admin`) → Supabase에서 읽어 목록 표시. 노션 아님.
- DB 접근은 **서버에서만** (`lib/supabase.ts`, service_role 키). 키 없으면 graceful 안내(빌드 안 깨짐).
- 환경변수(.env.local, git 제외): `SUPABASE_URL` · `SUPABASE_SERVICE_ROLE_KEY` · `ADMIN_PASSWORD`. 배포 시 Vercel 환경변수에도 동일하게.
- `inquiries` 스키마: id·name·phone·product·message·status('신규')·created_at. 설정법은 `docs/SUPABASE_SETUP.md`.

## 구조 (자세히는 docs/plan.md)
- `app/` 페이지(라우트) · `components/` 재사용 부품 · `lib/` 데이터(products·site) · `public/` 정적파일.
- 제품 상세는 **모달 아님 → 동적 라우트** `app/products/[id]/page.tsx` (검색·링크 공유 위해 메타데이터 설정).
- 제품 데이터 40종은 기존 사이트 `js/products.js`에서 이식 (`/Users/yj/stock report/bumil-safe/`).
