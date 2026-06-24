# Supabase 연결 가이드 (상담 접수 저장소)

구매자 상담글을 저장하고 `/admin`에서 보려면, 무료 Supabase 프로젝트 하나만 연결하면 됩니다. **약 5분.**

## 1) 프로젝트 만들기
1. https://supabase.com 가입 (GitHub 계정으로 가능)
2. **New project** → 이름(예: `bumil-safe`), DB 비밀번호 아무거나, Region은 `Northeast Asia (Seoul)` 추천 → 생성 (1~2분 소요)

## 2) 테이블 만들기
좌측 **SQL Editor** → 아래를 붙여넣고 **Run**:

```sql
create table inquiries (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  product text,
  message text not null,
  status text not null default '신규',
  created_at timestamptz not null default now()
);

-- 서버 키(service_role)에 이 테이블 읽기·쓰기 권한 부여 (이거 없으면 permission denied)
grant all on table public.inquiries to anon, authenticated, service_role;
grant usage, select, update on all sequences in schema public to anon, authenticated, service_role;
```

> "Run and enable RLS"를 눌러 RLS를 켜도 됩니다. 이 사이트는 **서버에서 service_role(secret) 키**로만 접근하고, 그 키는 RLS를 통과합니다. 단 위 `grant` 문은 꼭 실행하세요 — 안 그러면 `permission denied for table inquiries` 오류가 납니다.

## 3) 키 2개 복사
좌측 **Project Settings** → **API** (또는 **Data API**):
- **Project URL** (예: `https://abcd1234.supabase.co`)
- **service_role** 키 (Project API keys 아래, `secret` 표시) — ⚠️ 절대 공개 금지

## 4) .env.local 에 붙여넣기
프로젝트 루트 `bumil-safe/.env.local` 파일을 열어 채웁니다:

```
SUPABASE_URL=https://abcd1234.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...(긴 secret)
ADMIN_PASSWORD=원하는비밀번호
```

## 5) 서버 재시작 후 테스트
1. dev 서버 재시작 (환경변수는 재시작해야 반영됨)
2. `/contact` 에서 상담 폼 작성·제출 → "접수되었어요" 확인
3. `/admin` → 비밀번호(`ADMIN_PASSWORD`) 입력 → 방금 글이 목록에 보이면 성공 🎉
4. Supabase **Table Editor → inquiries** 에서도 같은 행을 볼 수 있어요.

## 배포할 때 (Vercel)
- 위 3개 환경변수를 **Vercel 프로젝트 Settings → Environment Variables** 에도 동일하게 넣어야 동작합니다.
- `/admin` 은 어디에도 링크돼 있지 않아요(판매자만 주소로 접속). 비밀번호는 충분히 길게.

## 보안 메모
- `service_role` 키는 모든 권한을 가집니다. `.env.local`(git 제외)과 Vercel 환경변수에만 두고, 코드·브라우저에 절대 노출하지 마세요.
- 현재 `/admin` 보호는 단순 비밀번호 쿠키입니다(연습용). 실서비스로 키우면 정식 인증으로 교체 권장.
