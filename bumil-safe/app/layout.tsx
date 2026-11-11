import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { TopBanner } from "@/components/TopBanner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/site";
import { PRODUCTS } from "@/lib/products";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "범일금고 영등포대리점 | 영등포 금고 전문 판매·설치",
    template: "%s | 범일금고 영등포대리점",
  },
  description:
    "범일금고 본사 정품을 취급하는 영등포 금고 대리점입니다. 가정용·사무용 금고 상담부터 전문 설치, 구매 후 A/S까지 책임집니다.",
  keywords: [
    "범일금고",
    "영등포 금고",
    "영등포 금고 대리점",
    "금고 대리점",
    "가정용 금고",
    "사무용 금고",
    "디자인금고",
    "지문인식금고",
    "금고 설치",
  ],
  alternates: { canonical: "/" },
  // 네이버 서치어드바이저·구글 서치콘솔의 사이트 소유확인 코드.
  // 값은 Vercel 환경변수로 넣으면 되고, 없으면 태그 자체가 출력되지 않는다.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_NAVER_VERIFICATION
      ? { "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_VERIFICATION }
      : {},
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "범일금고 영등포대리점",
    title: "범일금고 영등포대리점 | 영등포 금고 전문 판매·설치",
    description:
      "범일금고 본사 정품을 취급하는 영등포 금고 대리점입니다. 상담·설치·A/S까지 함께합니다.",
    // 카카오톡·네이버 공유 썸네일. 스크래퍼 호환을 위해 WebP가 아닌 JPEG를 쓴다.
    images: [{ url: "/og-image.jpg", width: 750, height: 750, alt: "범일금고 영등포대리점" }],
  },
};

// 지역 업체 구조화 데이터(JSON-LD) — 검색엔진·AI 검색이 상호·주소·전화·영업시간과
// "같은 업체의 다른 프로필(카카오 채널·스마트스토어·네이버 플레이스)"을 하나로 묶어 이해하도록.
// 값은 화면에 보이는 정보와 일치시킨다(전화·주소·시간은 lib/site.ts 기준).
const PRICES = PRODUCTS.map((p) => Number(p.price.replace(/[^0-9]/g, "")));
const fmtWon = (n: number) => `₩${n.toLocaleString("en-US")}`;

const LOCAL_BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Store",
      "@id": `${SITE_URL}/#store`,
      name: `${SITE.brand} ${SITE.branch}`,
      alternateName: [`${SITE.brand} 영등포`, `영등포 ${SITE.brand}`],
      description:
        "범일금고 본사 정품을 취급하는 영등포 금고 대리점. 가정용·사무용 금고 상담, 서울·경기 전 지역 전문 기사 방문 설치, 1년 무상 A/S.",
      image: `${SITE_URL}/og-image.jpg`,
      url: SITE_URL,
      telephone: "+82-2-2632-6070",
      priceRange: `${fmtWon(Math.min(...PRICES))}-${fmtWon(Math.max(...PRICES))}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${SITE.address.road} ${SITE.address.detail}`,
        addressLocality: "영등포구",
        addressRegion: "서울특별시",
        addressCountry: "KR",
      },
      // 네이버 지역검색 API가 돌려준 매장 좌표(mapx/mapy ÷ 1e7)
      geo: { "@type": "GeoCoordinates", latitude: 37.5206019, longitude: 126.899677 },
      hasMap: SITE.map.naver,
      areaServed: [
        { "@type": "AdministrativeArea", name: "서울특별시" },
        { "@type": "AdministrativeArea", name: "경기도" },
      ],
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      brand: { "@type": "Brand", name: SITE.brand },
      parentOrganization: { "@type": "Organization", name: SITE.brand, url: "https://bumilsafe.co.kr" },
      sameAs: [
        "https://pf.kakao.com/_bpxgiX",
        "https://smartstore.naver.com/safebumil",
        "https://map.naver.com/p/entry/place/1073548864",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `${SITE.brand} ${SITE.branch}`,
      alternateName: `${SITE.brand} 영등포`,
      inLanguage: "ko-KR",
      publisher: { "@id": `${SITE_URL}/#store` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* Pretendard — 기존 사이트와 동일하게 CDN 로드 */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSONLD) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <TopBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
      {/* 개발 서버(npm run dev)의 테스트 방문·클릭이 실제 방문자 통계에 섞이지 않도록 production에서만 로드 */}
      {process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
