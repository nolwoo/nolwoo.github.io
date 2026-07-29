// 배포용 서버리스 함수 (Vercel 등). 모드별 인사말을 반환한다.
import { getGreeting } from '../lib/chat.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const mode = typeof req.query.mode === 'string' ? req.query.mode : 'chat';
  res.status(200).json({ greeting: getGreeting(mode) });
}
