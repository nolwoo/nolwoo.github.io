// 로컬 개발용 서버: 정적 페이지(public/)를 서빙하고 POST /api/chat 을 처리한다.
// 실행: ANTHROPIC_API_KEY=sk-... node server.js   →  http://localhost:3000
// (.env 파일이 있으면 자동으로 읽어들인다)

import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';
import { getReply, getGreeting } from './lib/chat.js';
import { checkRateLimit, clientIp } from './lib/rateLimit.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, 'public');
const PORT = process.env.PORT || 3000;

// .env 파일을 (있으면) 간단히 로드 — 의존성 없이.
loadDotEnv(join(__dirname, '.env'));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
};

const server = createServer(async (req, res) => {
  try {
    if (req.method === 'POST' && req.url === '/api/chat') {
      return await handleChat(req, res);
    }
    if (req.method === 'GET' && req.url === '/api/greeting') {
      return sendJson(res, 200, { greeting: getGreeting() });
    }
    if (req.method === 'GET') {
      return serveStatic(req, res);
    }
    sendJson(res, 405, { error: 'Method Not Allowed' });
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: '서버 오류가 발생했어요.' });
  }
});

async function handleChat(req, res) {
  // 사용량 제한: 같은 IP의 연타·과다 호출 차단 (비용·남용 방어)
  const limit = checkRateLimit(clientIp(req));
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSec || 60));
    return sendJson(res, 429, {
      error:
        limit.reason === 'day'
          ? '오늘 이용 횟수가 많아 잠시 제한됐어요. 내일 다시 이용해 주세요. 🙏'
          : '잠깐만요, 너무 빠르게 보내셨어요. 몇 초 뒤 다시 시도해 주세요.',
    });
  }

  const body = await readBody(req);
  let messages;
  try {
    messages = JSON.parse(body).messages;
  } catch {
    return sendJson(res, 400, { error: '잘못된 요청 형식이에요.' });
  }
  try {
    const reply = await getReply(messages, process.env.ANTHROPIC_API_KEY);
    sendJson(res, 200, { reply });
  } catch (err) {
    console.error(err);
    const msg = /ANTHROPIC_API_KEY/.test(err.message)
      ? 'API 키가 설정되지 않았어요. README의 안내대로 ANTHROPIC_API_KEY를 넣어주세요.'
      : '답변을 가져오는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.';
    sendJson(res, 500, { error: msg });
  }
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = join(PUBLIC_DIR, normalize(urlPath));
  if (urlPath === '/' || urlPath === '') filePath = join(PUBLIC_DIR, 'index.html');
  // 디렉터리 탈출 방지
  if (!filePath.startsWith(PUBLIC_DIR)) {
    return sendJson(res, 403, { error: 'Forbidden' });
  }
  if (!existsSync(filePath)) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    return res.end('Not Found');
  }
  const data = readFileSync(filePath);
  res.writeHead(200, { 'content-type': MIME[extname(filePath)] || 'application/octet-stream' });
  res.end(data);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => {
      data += c;
      if (data.length > 1e6) reject(new Error('payload too large'));
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function sendJson(res, status, obj) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

function loadDotEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf-8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

server.listen(PORT, () => {
  const keyOk = !!process.env.ANTHROPIC_API_KEY;
  console.log(`\n  아들 육아 상담소 → http://localhost:${PORT}`);
  console.log(`  API 키: ${keyOk ? '설정됨 ✓' : '없음 ✗  (README 참고: .env 에 ANTHROPIC_API_KEY 넣기)'}\n`);
});
