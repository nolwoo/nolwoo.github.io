// 검색엔진 노출용 공통 상수 — 도메인 구매 후 NEXT_PUBLIC_SITE_URL 환경변수만 바꾸면
// sitemap·robots·OG 태그·구조화 데이터가 전부 새 도메인으로 갱신됩니다.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bumil-safe.vercel.app";
