# todo — 아들 맞춤 처방전

PRD·구현계획: `/Users/yj/.claude/plans/spicy-bubbling-honey.md` (Phase 1~3 완료)

## 🔴 지금 막고 있는 것 (공유 전 필수)

- [ ] **Vercel `ANTHROPIC_API_KEY` 재설정 + 재배포** — 라이브 `/api/chat`이 500 에러.
      예전에 노출됐던 키를 폐기했다면 새 키를 Vercel 프로젝트 Settings → Environment
      Variables에 넣고 재배포 필요. (본인만 가능 — Claude가 Vercel 계정에 접근 불가)
- [ ] 키 재설정 후 **라이브 재확인** (Claude에게 요청하면 바로 확인 가능)

## 🟡 PRD "출하 조건" 중 남은 것 (본인만 가능)

- [ ] Anthropic 콘솔에서 **월 지출 한도(Spending limit)** 설정 — console.anthropic.com

## ✅ 완료

- [x] 두 모드(긴급 처방 / 훈육 회고) 로컬 E2E 테스트
- [x] 아동학대·체벌 정당화 시나리오 안전장치 확인
- [x] 회고 저장 → 새로고침 → 기록 복원 확인
- [x] 지식베이스 4개 소스로 확장 (최민준·조선미·Becky Kennedy·AAP) + README/메타데이터 동기화
- [x] Ollama 스타일 UI 재적용, 모바일(375px) 레이아웃 확인
- [x] 보안 점검 — `.env` 비노출, 원본 transcript 파일 비공개, rate limit 정상 작동
- [x] `/api/greeting` 프로덕션 누락 버그 수정
- [x] 텍스트 입력창 캡슐 모양 버그 수정 (긴 회고 작성 시)

## 🔵 선택 (없어도 공유는 가능)

- [ ] 실제 휴대폰으로 최종 육안 확인 (지금까진 브라우저 시뮬레이션만 함)

## 참고 — 구독 인증 관련

API 키 대신 Claude 구독 로그인(`travel-planner`처럼)은 **못 씀** — Anthropic 정책상 구독 인증은
개인이 자기 컴퓨터에서 쓰는 용도로만 허용되고, Vercel 같은 공개 배포에는 애초에 그 로그인 세션이
존재하지 않음. 비용을 줄이려면 지출 한도 설정 또는 `lib/chat.js`의 `MODEL`을 더 저렴한 모델로 교체.
