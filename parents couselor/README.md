# 아들 육아 상담소 🧭

아들 키우는 부모가 "내 훈육 방식이 맞나?" 싶을 때, 자기 상황을 털어놓고 상담받는 챗봇 웹사이트.
**최민준 소장(아들연구소)의 영상 내용만을 근거**로 답합니다.

- 근거 영상: 지식인사이드 "지식인초대석" — 최민준 소장 풀버전
  (`자식이 의외로 평생 기억하고 고마워하는 부모의 한 마디`)
- 영상 전사 → 핵심 원칙 정리(`knowledge.md`) → Claude가 그 자료 안에서만 조언

## 구조

```
parents couselor/
├─ public/index.html   채팅 화면 (부모가 보는 페이지)
├─ lib/chat.js         핵심 로직: 지식베이스 + 안전장치를 Claude에 전달
├─ knowledge.md        최민준 소장 영상에서 뽑은 상담 지식베이스 (답변의 유일한 근거)
├─ server.js           로컬 실행용 서버
├─ api/chat.js         배포(Vercel)용 서버리스 함수
├─ transcript.txt      영상 원본 전사 (참고용)
└─ .env.example        API 키 넣는 양식
```

## 로컬에서 실행하기

1. **Anthropic API 키 발급** — https://console.anthropic.com/ → Settings → API Keys
2. 키를 `.env` 파일에 넣기:
   ```bash
   cp .env.example .env
   # .env 를 열어 ANTHROPIC_API_KEY=sk-ant-... 채우기
   ```
3. 실행 (Node 18+ 필요, 설치할 의존성 없음):
   ```bash
   npm run dev
   ```
4. 브라우저에서 http://localhost:3000 접속

키 없이 `npm run dev` 하면 페이지는 뜨지만, 메시지를 보내면 "API 키를 넣어달라"는 안내가 나옵니다.

## 인터넷에 배포하기 (Vercel, 무료)

1. 이 폴더를 GitHub 저장소로 올리기
2. https://vercel.com 에서 그 저장소를 import
3. **Environment Variables** 에 `ANTHROPIC_API_KEY` 추가 (키 노출 방지)
4. Deploy → 발급된 주소로 누구나 접속 가능

> 정적 페이지(`public/`)는 그대로 서빙되고, `api/chat.js` 가 서버리스 함수로 동작합니다.

## 비용

질문 1건마다 Claude API가 호출되어 **사용량만큼 소액 과금**됩니다(모델: `claude-opus-4-8`).
본인·지인 테스트 수준이면 적지만, 공개해서 많은 사람이 쓰면 늘어납니다.
먼저 소규모로 테스트하고 반응을 본 뒤 공개 범위를 넓히는 걸 권합니다.
비용을 낮추려면 `lib/chat.js` 의 `MODEL` 을 더 가벼운 모델(예: `claude-haiku-4-5-20251001`)로
바꿀 수 있습니다.

## 내용을 더하거나 바꾸려면

- **다른 영상·전문가 추가**: 새 전사를 `knowledge.md` 에 정리해 넣으면 됩니다. 답변 근거가 바로 바뀝니다.
- **말투·상담 태도 조정**: `lib/chat.js` 의 시스템 프롬프트(상담 태도/안전장치) 수정.
- **예시 질문·디자인**: `public/index.html` 의 `EXAMPLES` 배열과 CSS.

## 안전장치

- 답변은 의학적 진단이 아니라 한 전문가의 관점을 전하는 참고용임을 명시합니다.
- 아동학대·자해·심각한 위험 신호가 보이면 조언보다 먼저 전문기관(112, 1577-1391, 109 등)을 안내합니다.
