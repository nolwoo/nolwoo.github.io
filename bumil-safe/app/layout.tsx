import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { TopBanner } from "@/components/TopBanner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/site";
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

// 지역 업체 구조화 데이터(JSON-LD) — 검색엔진이 상호·주소·전화·영업시간을 명확히 이해하도록
const LOCAL_BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: `${SITE.brand} ${SITE.branch}`,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: SITE.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.road,
    addressLocality: "영등포구",
    addressRegion: "서울특별시",
    addressCountry: "KR",
  },
  areaServed: "영등포구",
  openingHours: "Mo-Fr 09:00-18:00",
  url: SITE_URL,
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
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
