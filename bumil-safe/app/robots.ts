import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// /admin(판매자 상담 접수 페이지)은 비밀번호로 보호되지만, 검색 노출까지 막아 이중으로 안전하게
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
