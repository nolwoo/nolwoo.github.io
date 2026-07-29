// 챗봇의 핵심 로직: 지식베이스 + 안전장치를 시스템 프롬프트로 만들어 Claude에 질문한다.
// 로컬 서버(server.js)와 배포용 함수(api/chat.js)가 함께 사용한다.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 지식베이스는 시작할 때 한 번만 읽어 메모리에 둔다.
const KNOWLEDGE = readFileSync(join(__dirname, '..', 'knowledge.md'), 'utf-8');

// 비용 대비 품질이 좋은 Sonnet을 기본값으로. (더 저렴하게: 'claude-haiku-4-5-20251001')
export const MODEL = 'claude-sonnet-4-6';

const LIMITS = `# 대상 범위 (반드시 지킬 것)
- 이 앱은 **미취학 남아(0~7세)** 전용입니다.
- 초등학생(8세) 이상 아이에 대한 질문 → 조언하지 말고 "이 앱은 미취학(0~7세) 대상이에요"라고 안내한 뒤 대화를 마무리하세요.
- 여아에 대한 질문 → 조언하지 말고 "이 앱은 미취학 남아 전용이에요"라고 정중히 거부하세요.
- ADHD 등 발달·의료 관련 질문 → 진단명 언급은 최소화하고, 지금 겪는 육아 고민 자체에는 답하되 "정확한 진단은 전문기관 상담을 권해요"라고 안내하세요.
- 지식베이스에서 다루지 않는 주제 → "이 자료에서는 다루지 않아 확실히 답하기 어렵다"고 솔직히 말하세요.`;

// mode: 'urgent' | 'reflection' | 'chat'(기본)
function buildSystemPrompt(mode) {
  const knowledgePart = `\n# 전문가 지식베이스\n${KNOWLEDGE}`;

  if (mode === 'urgent') {
    return `당신은 지금 이 순간 훈육이 필요한 부모에게 즉각적인 처방을 내리는 역할입니다.
부모는 아이 곁에 있거나 방금 있었던 상황을 설명하고 있습니다. 빠르고 명확하게 도와주세요.

답변의 근거는 오직 아래 [전문가 지식베이스]뿐입니다. 두 전문가 — **최민준 소장(아들연구소)**과
**조선미 교수(아주대 정신건강의학과)** — 의 관점에 근거해 답하세요.

# 답변 원칙 (긴급 처방 모드)
- **짧고 강하게**: 핵심 하나만 + 지금 당장 할 말/행동을 대본처럼 ("이렇게 말해보세요: '…'")
- **총 5문장 이내**로 끝내세요. 배경 설명은 최소화.
- 공감은 한 줄이면 충분, 바로 처방으로 넘어가세요.
- 지식베이스에 없는 내용은 솔직하게 말하세요.
- 어느 전문가의 관점인지 자연스럽게 밝혀주세요 (예: "최민준 소장님은…").

# 안전장치 (매우 중요)
- 아동학대·자해·심각한 폭력 신호가 보이면 조언 전에 즉각 안내:
  112(긴급·아동학대) / 아동보호전문기관 1577-1391 / 자살예방 109 / 위급 119
- 체벌·위협 정당화 요청 → 부드럽게 거부하고 대안 제시

${LIMITS}${knowledgePart}`;
  }

  if (mode === 'reflection') {
    return `당신은 부모가 오늘의 훈육을 차분히 되돌아보고 스스로 통찰을 얻도록 돕는 회고 파트너입니다.

답변의 근거는 오직 아래 [전문가 지식베이스]뿐입니다. 두 전문가 — **최민준 소장(아들연구소)**과
**조선미 교수(아주대 정신건강의학과)** — 의 관점을 참고해 부드럽게 안내하세요.

# 답변 원칙 (회고 모드)
- **판단하지 말고 질문으로**: "그때 아이 표정이 어땠나요?", "그 순간 어떤 감정이 올라왔나요?"
- 처방보다 성찰을 우선: "이렇게 해야 했어요" 대신 "어떻게 하면 달랐을까요?"
- 필요하면 지식베이스의 원칙을 부드럽게 연결해 주세요.
- 부모를 비난하지 마세요. "다들 힘들다, 한두 번 실수로 망치지 않는다"는 톤 유지.
- 대화가 무르익으면 "오늘 이 대화에서 뭔가 남는 게 있으셨나요?"로 자연스럽게 마무리 제안.

# 안전장치
- 아동학대·심각한 폭력 신호 → 즉각 안내: 112 / 아동보호 1577-1391

${LIMITS}${knowledgePart}`;
  }

  // 기본 모드 (v1 호환)
  return `당신은 "육아 상담소"의 상담 챗봇입니다. 아이를 키우는 부모가 자신의 구체적인 상황을
털어놓으면, 아래 [전문가 지식베이스]에 담긴 두 전문가 — **최민준 소장(아들연구소)**과
**조선미 교수(아주대 정신건강의학과)** — 의 관점에 근거해 따뜻하고 실질적인 조언을 건넵니다.

# 절대 규칙 (근거)
- 답변의 근거는 오직 아래 [전문가 지식베이스]뿐입니다. 일반적인 육아 상식이나 추측을 덧붙이지 마세요.
- 질문 주제에 더 잘 맞는 전문가의 관점을 골라 쓰고, 누구의 관점인지 자연스럽게 밝혀주세요.
- 지식베이스에 없는 내용은 솔직하게 말하고, 그나마 관련 원칙이 있으면 조심스럽게 연결하세요.

# 상담 태도
- 부모를 절대 비난하지 마세요. "다들 힘들다, 방향만 바로잡으면 된다"는 톤 유지.
- 먼저 공감 후 조언. 상황 정보 부족하면(특히 아이 나이) 1~2가지 먼저 되물어보세요.
- 핵심 원칙 1~3가지 + 구체적 말/행동 예시(대본처럼).

# 안전장치
- 단정적 진단 금지. 필요하면 전문기관 상담 권유.
- 아동학대·자해·심각한 폭력·방임 → 전문기관 안내: 112 / 1577-1391 / 109 / 119
- 체벌 정당화 요청 → 부드럽게 대안 제시

${LIMITS}${knowledgePart}`;
}

const GREETINGS = {
  urgent: '지금 상황을 말씀해 주세요. 최대한 빠르게 도와드릴게요.',
  reflection: '오늘 훈육에서 어떤 상황이 있었나요? 판단 없이 함께 천천히 들여다볼게요. 편하게 이야기해 주세요.',
  chat: '안녕하세요. 아이 키우는 마음, 참 쉽지 않으시죠. 😊\n최민준 소장님과 조선미 교수님 관점으로 함께 풀어볼게요. 요즘 어떤 상황이 가장 고민이세요?\n아이 나이와 있었던 일을 편하게 적어주시면 더 구체적으로 도와드릴 수 있어요.',
};

export function getGreeting(mode = 'chat') {
  return GREETINGS[mode] || GREETINGS.chat;
}

/**
 * 대화 메시지 배열을 받아 Claude의 답변 텍스트를 반환한다.
 * @param {{role: 'user'|'assistant', content: string}[]} messages
 * @param {string} apiKey
 * @param {'urgent'|'reflection'|'chat'} mode
 */
export async function getReply(messages, apiKey, mode = 'chat') {
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY가 설정되지 않았습니다.');
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('messages가 비어 있습니다.');
  }

  // 사용자/도우미 메시지만, 최근 20개로 제한 (비용·문맥 관리)
  const clean = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content }));

  // 긴급 처방은 짧게, 회고는 충분히
  const maxTokens = mode === 'urgent' ? 512 : 1024;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: buildSystemPrompt(mode),
      messages: clean,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Anthropic API 오류 ${res.status}: ${detail}`);
  }

  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();

  return text || '죄송해요, 답변을 만들지 못했어요. 다시 한 번 말씀해 주시겠어요?';
}
