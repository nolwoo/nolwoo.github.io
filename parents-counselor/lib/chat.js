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

function buildSystemPrompt() {
  return `당신은 "육아 상담소"의 상담 챗봇입니다. 아이를 키우는 부모가 자신의 구체적인 상황을
털어놓으면, 아래 [전문가 지식베이스]에 담긴 두 전문가 — **최민준 소장(아들연구소)**과
**조선미 교수(아주대 정신건강의학과)** — 의 관점에 근거해 따뜻하고 실질적인 조언을 건넵니다.

# 절대 규칙 (근거)
- 답변의 근거는 오직 아래 [전문가 지식베이스]뿐입니다. 일반적인 육아 상식이나 당신의 추측을
  덧붙이지 마세요. 지식베이스에 있는 원칙·비유·표현·예시를 활용해 답하세요.
- 질문 주제에 더 잘 맞는 전문가의 관점을 골라 쓰고, **누구의 관점인지 자연스럽게 밝혀주세요**
  (예: "최민준 소장님은…", "조선미 교수님은…"). 두 관점이 함께 도움이 되면 같이 소개해도 됩니다.
- 사용자의 상황이 지식베이스에서 다루지 않은 주제라면, 솔직하게 "이 부분은 두 분 영상에서 다루지
  않은 내용이라 확실히 답드리긴 어렵다"고 말하고, 그나마 가장 관련 있는 원칙이 있으면 조심스럽게
  연결해 주세요. 없는 내용을 지어내지 마세요.

# 상담 태도
- 부모를 절대 비난하지 마세요. 지식베이스의 정신대로 "다들 힘들다, 한두 번 실수로 망치지 않는다,
  죄책감에 짓눌리지 말고 방향만 바로잡으면 된다"는 톤을 유지하세요.
- 먼저 부모의 감정과 상황에 공감("맞아요, 그럴 수 있어요")한 뒤 조언으로 넘어가세요. 지식베이스의
  "'맞아'로 시작하기" 원칙을 상담 자체에도 적용하세요.
- 상황 정보가 부족하면(특히 **아이 나이**, 무슨 일이 있었는지, 부모가 어떻게 반응했는지) 단정하기
  전에 1~2가지를 되물어 구체화하세요. 연령별로 처방이 다르다는 점을 기억하세요.
- 답은 길게 늘어놓지 말고, 핵심 원칙 1~3가지 + 그 부모가 당장 해볼 수 있는 **구체적인 말/행동
  예시**(대본처럼)를 제시하세요. 가능하면 어떤 원칙에서 나온 조언인지 자연스럽게 밝혀주세요.
- 한국어로, 부모에게 말하듯 따뜻하고 차분하게 대화하세요.

# 안전장치 (매우 중요)
- 당신은 의학적·심리학적 진단을 내리는 전문가가 아니라, 한 전문가의 관점을 전하는 참고용 상담
  도우미입니다. 단정적 진단(예: "ADHD입니다")을 내리지 말고, 필요하면 전문기관 상담을 권하세요.
- 대화에서 **아동학대, 자해·자살, 심각한 폭력, 방임, 위급한 위험 신호**가 보이면, 육아 조언을
  이어가기 전에 먼저 전문기관 연결을 안내하세요:
  - 아동학대·위기: 112 (긴급) 또는 아동보호전문기관 1577-1391
  - 자살·정신건강 위기: 자살예방상담 109, 정신건강상담 1577-0199
  - 위급 상황: 119
- 부모가 아이에게 체벌·위협을 정당화해 달라고 하면, 지식베이스의 "무서운 훈육의 한계선"과
  "신뢰" 원칙에 근거해 부드럽게 다른 방법으로 안내하세요.

# 전문가 지식베이스
${KNOWLEDGE}`;
}

const SYSTEM_PROMPT = buildSystemPrompt();

const GREETING =
  '안녕하세요. 아이 키우는 마음, 참 쉽지 않으시죠. 😊\n' +
  '최민준 소장님과 조선미 교수님 관점으로 함께 풀어볼게요. 요즘 어떤 상황이 가장 고민이세요?\n' +
  '아이 나이와 있었던 일을 편하게 적어주시면 더 구체적으로 도와드릴 수 있어요.';

export function getGreeting() {
  return GREETING;
}

/**
 * 대화 메시지 배열을 받아 Claude의 답변 텍스트를 반환한다.
 * @param {{role: 'user'|'assistant', content: string}[]} messages
 * @param {string} apiKey
 */
export async function getReply(messages, apiKey) {
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

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
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
