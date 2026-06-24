import { PRODUCTS, type Product, type ProductCat } from "./products";

/* 카테고리 탭 (가상 탭 all·best 포함) */
export const CATEGORIES = [
  { key: "all", label: "전체상품" },
  { key: "best", label: "베스트" },
  { key: "smart", label: "디자인금고" },
  { key: "finger", label: "지문인식금고" },
  { key: "basic", label: "가정·사무용금고" },
] as const;

export type CatKey = (typeof CATEGORIES)[number]["key"];

/* 정렬 옵션 */
export const SORTS = [
  { key: "popular", label: "인기도순" },
  { key: "new", label: "최신등록순" },
  { key: "low", label: "낮은 가격순" },
  { key: "high", label: "높은 가격순" },
  { key: "discount", label: "할인율순" },
  { key: "review", label: "리뷰 많은순" },
  { key: "rating", label: "평점 높은순" },
] as const;

export type SortKey = (typeof SORTS)[number]["key"];

export const priceToNumber = (p: string): number =>
  Number(p.replace(/[^0-9]/g, "")) || 0;

export function filterByCat(cat: CatKey): Product[] {
  if (cat === "all") return PRODUCTS;
  if (cat === "best") return PRODUCTS.filter((p) => p.best);
  return PRODUCTS.filter((p) => p.cat === (cat as ProductCat));
}

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const arr = [...list];
  switch (sort) {
    case "low":
      return arr.sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));
    case "high":
      return arr.sort((a, b) => priceToNumber(b.price) - priceToNumber(a.price));
    case "discount":
      return arr.sort((a, b) => b.discount - a.discount);
    case "review":
      return arr.sort((a, b) => b.reviews - a.reviews);
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating);
    case "popular":
    default:
      // 인기도 ≈ 리뷰수 기준 (BEST 우선)
      return arr.sort(
        (a, b) => Number(b.best) - Number(a.best) || b.reviews - a.reviews,
      );
  }
}

export const getProduct = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id);

/* 홈 인기 제품 N종 */
export const getPopular = (n = 6): Product[] =>
  [...PRODUCTS]
    .filter((p) => p.best)
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, n);
