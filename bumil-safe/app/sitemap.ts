import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";
import { SITE_URL } from "@/lib/seo";

// 정적 페이지 + 제품 상세 40종을 모두 포함 — 네이버/구글 서치콘솔에 이 URL 하나만 제출하면 됨
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/products", priority: 0.9 },
    { path: "/about", priority: 0.7 },
    { path: "/service", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    { path: "/location", priority: 0.8 },
  ].map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    priority: r.priority,
  }));

  const productRoutes = PRODUCTS.map((p) => ({
    url: `${SITE_URL}/products/${p.id}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
