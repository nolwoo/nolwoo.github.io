import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import { TopBanner } from "@/components/TopBanner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "범일금고 영등포대리점 | 소중한 것을 가장 안전하게",
    template: "%s | 범일금고 영등포대리점",
  },
  description:
    "범일금고 본사 정품을 영등포에서. 가정용·사무용 금고 상담부터 전문 설치, 사후관리까지 함께합니다.",
};

/* 디스플레이 세리프 — 헤드라인 전용. 본문은 Pretendard 유지 */
const notoSerif = Noto_Serif_KR({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-serif",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased ${notoSerif.variable}`}>
      <head>
        {/* Pretendard — 기존 사이트와 동일하게 CDN 로드 */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <TopBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
