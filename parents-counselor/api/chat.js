// 배포용 서버리스 함수 (Vercel 등). 환경변수 ANTHROPIC_API_KEY 를 사용한다.
import { getReply } from '../lib/chat.js';
import { checkRateLimit, clientIp } from '../lib/rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // 사용량 제한: 같은 IP의 연타·과다 호출 차단 (비용·남용 방어)
  const limit = checkRateLimit(clientIp(req));
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSec || 60));
    res.status(429).json({
      error:
        limit.reason === 'day'
          ? '오늘 이용 횟수가 많아 잠시 제한됐어요. 내일 다시 이용해 주세요. 🙏'
          : '잠깐만요, 너무 빠르게 보내셨어요. 몇 초 뒤 다시 시도해 주세요.',
    });
    return;
  }

  try {
    // Vercel은 req.body를 자동 파싱하지만, 안전하게 양쪽 다 처리한다.
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const reply = await getReply(body.messages, process.env.ANTHROPIC_API_KEY);
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    const msg = /ANTHROPIC_API_KEY/.test(err.message)
      ? '서버에 API 키가 설정되지 않았어요.'
      : '답변을 가져오는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.';
    res.status(500).json({ error: msg });
  }
}
