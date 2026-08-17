// =====================================================================
//  범일금고 영등포대리점 — 사이트 공통 정보 (한 곳에서 관리)
//  기존 사이트 js/config.js 대응
// =====================================================================

// 헤더 높이(px) — Header.tsx(높이)·HeroCarousel.tsx(음수 마진·컨트롤 위치)가
// 공유하는 유일한 값. 헤더 높이를 바꿀 땐 여기만 고치면 된다.
export const HEADER_HEIGHT_PX = 56;

export const SITE = {
  brand: "범일금고",
  branch: "영등포대리점",
  tagline: "소중한 것을 가장 안전하게",
  phone: "02-2632-6070",
  phoneHref: "tel:0226326070",

  // 카카오톡 채널 홈 URL. 비워두면 버튼 클릭 시 "준비 중" 안내.
  // (카카오톡 채널 관리자센터 → 채널 → "채널 홈 URL" 복사)
  kakaoUrl: "http://pf.kakao.com/_bpxgiX",

  // 네이버 스마트스토어 — 실제 구매 후기는 여기서 확인.
  // 제품에 개별 storeUrl이 없으면 이 스토어 홈으로 연결.
  storeUrl: "https://smartstore.naver.com/bumilsafeco",

  address: {
    road: "서울 영등포구 영등포로 164",
    jibun: "서울 영등포구 당산동1가 6",
    hours: "평일 09:00–18:00 (주말·공휴일 상담 가능)",
  },

  map: {
    naver:
      "https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%20%EC%98%81%EB%93%B1%ED%8F%AC%EA%B5%AC%20%EC%98%81%EB%93%B1%ED%8F%AC%EB%A1%9C%20164",
    kakao:
      "https://map.kakao.com/?q=%EC%84%9C%EC%9A%B8%20%EC%98%81%EB%93%B1%ED%8F%AC%EA%B5%AC%20%EC%98%81%EB%93%B1%ED%8F%AC%EB%A1%9C%20164",
  },
} as const;

// 사이트 내비게이션 (헤더·푸터 공용)
export const NAV = [
  { label: "제품", href: "/products" },
  { label: "회사소개", href: "/about" },
  { label: "서비스", href: "/service" },
  { label: "상담", href: "/contact" },
  { label: "오시는길", href: "/location" },
] as const;
