# todo — 범일금고 Next.js 재구축

> 위에서부터 순서대로. 끝나면 `[x]` 체크하며 커밋. (무엇=docs/PRD.md · 어떻게=docs/plan.md)

## 챕터 2 · 기획 (완료)
- [x] 문제정의 (누가·왜·무엇)
- [x] PRD.md 작성 (사이트맵 home+4·섹션·CTA)
- [x] plan.md 작성 (구조·순서)
- [x] todo.md 작성 (이 문서)
- [x] PRD/plan 사용자 검토·다듬기 (제품 상세=라우트만, /guide 제외)

## 챕터 3 · Next.js 셋업 + 디자인 기반
- [x] create-next-app으로 Next.js 셋업 (TS·App Router·Tailwind v4, Next 16)
- [x] CLAUDE.md 확장 (작업방식·디자인·도메인 규칙) — 스타터 @AGENTS.md 유지
- [x] 디자인 토큰 이식 (골드 #b88a2e·Pretendard) → globals.css @theme, layout 폰트·lang=ko·메타
- [x] dev 서버 동작 확인 (HTTP 200·에러 없음)
- [ ] 저장하고 `/compact` (빌드 전 정리) — 사용자가 직접 실행

## 디자인 레퍼런스 변경
- [x] Apple 디자인 시스템 채택 → docs/DESIGN.md, globals.css 토큰 교체 (Action Blue·잉크·파치먼트·다크타일)

## 챕터 4 · 다중페이지 빌드
### 공유 부품 먼저 (직렬)
- [x] lib/site.ts (매장정보·전화·카카오 URL) + NAV
- [x] TopBanner / Header(모바일 드로어) / Footer
- [x] ConsultButtons (카톡·전화) + Button(pill 문법) + Container
- [x] SectionHead
- [x] styleguide로 공유 부품 확인·승인 (모바일·데스크톱 스크린샷)
- [ ] TrustItem / Marquee (페이지 빌드 때 함께)
### 제품 데이터·컴포넌트
- [x] lib/products.ts (40종 자동 이식 + Product 타입) + lib/catalog.ts (필터·정렬·조회)
- [x] ProductCard / ProductBrowser(탭·정렬, client) / TrustItem
### 페이지 (공유 부품 import)
- [x] 홈 `/` (히어로·인기제품·철학타일·세 기준·서비스·CTA)
- [x] 제품 목록 `/products` (탭·정렬·그리드·상담띠)
- [x] 제품 상세 `/products/[id]` (40종 SSG·메타데이터·관련제품)
- [x] 회사소개 `/about` (수치·세 기준)
- [x] 서비스 `/service` (설치·A/S 4단계·FAQ)
- [x] 상담 `/contact` (카톡·전화·지도·매장정보)
### 마무리
- [x] 프로덕션 빌드 통과 (49 정적페이지, 타입·에러 0)
- [x] 반응형 점검 (홈·제품·상세 데스크톱/모바일 스크린샷)
- [ ] 카피·접근성·시맨틱 다듬기 (선택)
- [ ] `/code-review` (선택)
- [ ] (옵션) 마퀴·스타일가이드 정리

## 추가 기능 · 상담 접수 (Supabase)
- [x] Supabase 클라이언트(lib/supabase.ts, 서버 전용)
- [x] API: POST /api/inquiry (저장) · /api/admin-login (로그인·로그아웃)
- [x] 구매자 상담폼 InquiryForm → /contact 연결
- [x] 판매자 /admin (비밀번호 게이트 + 목록)
- [x] .env.local / .env.example (SUPABASE_URL·SERVICE_ROLE_KEY·ADMIN_PASSWORD)
- [x] 빌드·API 동작 검증 (검증·미연결 graceful)
- [x] 사용자: Supabase 프로젝트 생성 + 키 입력 (docs/SUPABASE_SETUP.md)
- [x] 테이블 권한(grant) 부여 → 실제 저장→/admin 표시 종단 테스트 통과 ✓

## 커밋 전 점검 (완료)
- [x] ESLint 통과 (TopBanner를 useSyncExternalStore로 수정)
- [x] 프로덕션 빌드 통과 (51 페이지)
- [x] git 범위 안전 (.env.local·node_modules·.next 제외 확인)
- [x] 보안: /admin 쿠키를 비밀번호 파생 토큰으로 강화 (위조 차단 검증)
- [x] 견고성: 상담 폼 서버측 길이 제한 추가
- [x] 스팸 방지: 허니팟 + IP rate-limit(10분 6회) 추가·검증
- [x] favicon 교체 (app/icon.svg "B" 작은탭 + app/apple-icon.tsx BUMILSAFE 워드마크)
- [x] styleguide 배포 시 숨김 (프로덕션 404, 로컬 dev만 노출)

## 챕터 5 · 배포
- [x] git 커밋·푸시 → GitHub 레포 (nolwoo/bumil-safe-next, 비공개)
- [x] Vercel Import → 배포 (bumil-safe-next.vercel.app)
- [x] 공개 URL로 동작 확인 (전 페이지 200·상담폼 종단 테스트·styleguide 404 숨김)
