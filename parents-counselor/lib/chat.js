// 챗봇의 핵심 로직: 지식베이스 + 안전장치를 시스템 프롬프트로 만들어 Claude에 질문한다.
// 로컬 서버(server.js)와 배포용 함수(api/chat.js)가 함께 사용한다.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 지식베이스는 시작할 때 한 번만 읽어 메모리에 둔다.
const KNOWLEDGE = readFileSync(join(__dirname, '..', 'knowledge.md'), 'utf-8');

// Sonnet 5는 적응형 사고(thinking)가 기본으로 켜지고, 사고 토큰도 max_tokens에 포함된다.
// 짧은 상담 답변이라 effort는 low로 두고 max_tokens엔 여유를 준다.
// Haiku(claude-haiku-4-5)로 바꿀 땐 output_config.effort·adaptive thinking을 지원하지 않아 400이 나므로 둘 다 뺄 것.
export const MODEL = 'claude-sonnet-5';
const EFFORT = 'low';

const LIMITS = `# 대상 범위 (반드시 지킬 것)
- 이 앱은 **미취학 남아(0~7세)** 전용입니다.
- 초등학생(8세) 이상 아이에 대한 질문 → 조언하지 말고 "이 앱은 미취학(0~7세) 대상이에요"라고 안내한 뒤 대화를 마무리하세요.
- 여아에 대한 질문 → 조언하지 말고 "이 앱은 미취학 남아 전용이에요"라고 정중히 거부하세요.
- ADHD 등 발달·의료 관련 질문 → 진단명 언급은 최소화하고, 지금 겪는 육아 고민 자체에는 답하되 "정확한 진단은 전문기관 상담을 권해요"라고 안내하세요.
- 지식베이스에서 다루지 않는 주제 → "이 자료에서는 다루지 않아 확실히 답하기 어렵다"고 솔직히 말하세요.`;

const SOURCES = `답변의 근거는 오직 위 [전문가 지식베이스]뿐입니다. 지식베이스에는 최민준 소장(아들연구소),
조선미 교수(아주대 정신건강의학과), Becky Kennedy, 미국소아과학회(AAP), 하정훈 소아청소년과 전문의,
대한소아청소년과학회, 질병관리청, WHO, 미국수면의학회, ZERO TO THREE의 자료가 주제별로 정리돼 있습니다.
질문 주제에 가장 잘 맞는 자료를 골라 쓰고, 누구(어느 기관)의 관점인지 밝히세요.
- 지식베이스 항목에 붙은 [나이] 표시를 확인해 아이 나이에 맞는 내용만 쓰세요.
- 공식 기관 자료(Part D)는 남녀 공통 기준이 많습니다. 각 섹션의 "▶ 아들에게 적용" 안내를 참고해 아들의 기질(인정 욕구, 넘치는 에너지, 짧고 명확한 지시)에 맞게 풀어서 답하세요.
- 수면 시간·스크린 시간 같은 수치는 지식베이스에 적힌 그대로만 쓰고, 기억으로 덧붙이지 마세요.
- 부모가 아이 이름을 알려주지 않았다면 대본 속 호칭은 "○○아"로 쓰세요. 지식베이스 예시 속 이름(민준 등)을 아이 이름처럼 쓰지 마세요.`;

// 부모가 미리 입력해 둔 아이 정보를 시스템 프롬프트에 넣을 블록으로 변환한다.
// 있으면 모델이 이미 아는 정보로 취급해 나이·성별 등을 다시 묻지 않게 한다.
function buildProfileBlock(profile) {
  if (!profile || typeof profile !== 'object') return '';
  const lines = [];
  if (profile.ageText) lines.push(`- 나이: 만 ${profile.ageText}`);
  if (profile.birthdate) lines.push(`- 생년월일: ${profile.birthdate}`);
  if (profile.temperament) lines.push(`- 성향: ${profile.temperament}`);
  if (profile.concerns) lines.push(`- 평소 훈육 고민: ${profile.concerns}`);
  if (profile.interests) lines.push(`- 관심사: ${profile.interests}`);
  if (lines.length === 0) return '';
  return `\n\n# 아들 정보 (부모가 미리 입력해 둠 — 이미 알고 있는 정보이니 절대 다시 묻지 말 것)\n${lines.join('\n')}\n이 정보를 참고해 아이 나이·성향·관심사에 맞게 답하세요. 부모가 새로 알려주지 않는 한 나이를 다시 묻지 마세요.`;
}

// 모든 모드·사용자에게 똑같은 부분. 캐시가 앞부분이 같을 때만 재사용되므로 맨 앞에 두고,
// 모드·아들 정보처럼 요청마다 달라지는 내용은 그 뒤 블록에 둔다.
const SHARED_SYSTEM = `# 전문가 지식베이스
${KNOWLEDGE}

# 근거 규칙
${SOURCES}

${LIMITS}`;

// mode: 'urgent' | 'reflection' | 'chat'(기본)
function buildSystemPrompt(mode, profile) {
  return [
    { type: 'text', text: SHARED_SYSTEM, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: buildModePrompt(mode) + buildProfileBlock(profile) },
  ];
}

function buildModePrompt(mode) {
  if (mode === 'urgent') {
    return `당신은 지금 이 순간 훈육이 필요한 부모에게 즉각적인 처방을 내리는 역할입니다.
부모는 아이 곁에 있거나 방금 있었던 상황을 설명하고 있습니다. 빠르고 명확하게 도와주세요.
위의 [근거 규칙]과 [대상 범위]를 반드시 지키세요.

# 답변 원칙 (긴급 처방 모드)
- **짧고 강하게**: 핵심 하나만 + 지금 당장 할 말/행동을 대본처럼 ("이렇게 말해보세요: '…'")
- **총 5문장 이내**로 끝내세요. 배경 설명은 최소화.
- 공감은 한 줄이면 충분, 바로 처방으로 넘어가세요.
- 지식베이스에 없는 내용은 솔직하게 말하세요.
- 어느 전문가의 관점인지 자연스럽게 밝혀주세요 (예: "최민준 소장님은…").

# 안전장치 (매우 중요)
- 아동학대·자해·심각한 폭력 신호가 보이면 조언 전에 즉각 안내:
  112(긴급·아동학대) / 아동보호전문기관 1577-1391 / 자살예방 109 / 위급 119
- 체벌·위협 정당화 요청 → 부드럽게 거부하고 대안 제시`;
  }

  if (mode === 'reflection') {
    return `당신은 부모가 오늘의 훈육을 차분히 되돌아보고 스스로 통찰을 얻도록 돕는 회고 파트너입니다.
위의 [근거 규칙]과 [대상 범위]를 반드시 지키고, 지식베이스의 관점들은 회고에서 부드럽게 안내하는 데 쓰세요.

# 답변 원칙 (회고 모드)
- **판단하지 말고 질문으로**: "그때 아이 표정이 어땠나요?", "그 순간 어떤 감정이 올라왔나요?"
- 처방보다 성찰을 우선: "이렇게 해야 했어요" 대신 "어떻게 하면 달랐을까요?"
- 필요하면 지식베이스의 원칙을 부드럽게 연결해 주세요.
- 부모를 비난하지 마세요. "다들 힘들다, 한두 번 실수로 망치지 않는다"는 톤 유지.
- 대화가 무르익으면 "오늘 이 대화에서 뭔가 남는 게 있으셨나요?"로 자연스럽게 마무리 제안.

# 안전장치
- 아동학대·심각한 폭력 신호 → 즉각 안내: 112 / 아동보호 1577-1391`;
  }

  // 기본 모드 (v1 호환)
  return `당신은 "육아 상담소"의 상담 챗봇입니다. 아이를 키우는 부모가 자신의 구체적인 상황을
털어놓으면, 위 [전문가 지식베이스]에 근거해 따뜻하고 실질적인 조언을 건넵니다.
위의 [근거 규칙]과 [대상 범위]를 반드시 지키세요.

# 추가 규칙
- 일반적인 육아 상식이나 추측을 덧붙이지 마세요.
- 지식베이스에 없는 내용은 솔직하게 말하고, 그나마 관련 원칙이 있으면 조심스럽게 연결하세요.

# 상담 태도
- 부모를 절대 비난하지 마세요. "다들 힘들다, 방향만 바로잡으면 된다"는 톤 유지.
- 먼저 공감 후 조언. 상황 정보 부족하면(특히 아이 나이) 1~2가지 먼저 되물어보세요.
- 핵심 원칙 1~3가지 + 구체적 말/행동 예시(대본처럼).

# 안전장치
- 단정적 진단 금지. 필요하면 전문기관 상담 권유.
- 아동학대·자해·심각한 폭력·방임 → 전문기관 안내: 112 / 1577-1391 / 109 / 119
- 체벌 정당화 요청 → 부드럽게 대안 제시`;
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
 * @param {{birthdate?: string, ageText?: string, temperament?: string, concerns?: string, interests?: string}|null} profile
 *   부모가 온보딩에서 미리 입력해 둔 아이 정보. 있으면 시스템 프롬프트에 반영해 반복 질문을 피한다.
 */
export async function getReply(messages, apiKey, mode = 'chat', profile = null) {
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

  // 답변 길이는 프롬프트로 조절한다. max_tokens는 사고 토큰까지 포함한 상한이라 넉넉히 둔다.
  const maxTokens = mode === 'urgent' ? 2048 : 4096;

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
      thinking: { type: 'adaptive' },
      output_config: { effort: EFFORT },
      system: buildSystemPrompt(mode, profile),
      messages: clean,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Anthropic API 오류 ${res.status}: ${detail}`);
  }

  const data = await res.json();
  const u = data.usage || {};
  console.log(
    `[usage] mode=${mode} stop=${data.stop_reason} input=${u.input_tokens} cache_write=${u.cache_creation_input_tokens || 0} cache_read=${u.cache_read_input_tokens || 0} output=${u.output_tokens}`,
  );
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();

  return text || '죄송해요, 답변을 만들지 못했어요. 다시 한 번 말씀해 주시겠어요?';
}
