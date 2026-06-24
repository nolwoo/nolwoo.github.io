"use client";

import { useMemo, useState } from "react";
import {
  CATEGORIES,
  SORTS,
  filterByCat,
  sortProducts,
  type CatKey,
  type SortKey,
} from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

export function ProductBrowser() {
  const [cat, setCat] = useState<CatKey>("all");
  const [sort, setSort] = useState<SortKey>("popular");

  const list = useMemo(() => sortProducts(filterByCat(cat), sort), [cat, sort]);
  const catLabel = CATEGORIES.find((c) => c.key === cat)?.label ?? "전체상품";

  return (
    <div>
      {/* 카테고리 탭 */}
      <div className="flex flex-wrap gap-2 border-b border-hairline pb-4">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={`rounded-pill px-4 py-2 text-[14px] font-medium transition-colors ${
              cat === c.key
                ? "bg-ink text-white"
                : "bg-parchment text-ink-muted hover:text-ink"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 제목 + 개수 + 정렬 */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-semibold text-ink">{catLabel}</h2>
          <p className="mt-1 text-[13px] text-ink-faint">
            홈 &gt; <b className="text-ink-muted">{catLabel}</b> (총 {list.length}개)
          </p>
        </div>
        <label className="text-[14px] text-ink-muted">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-sm border border-hairline bg-canvas px-3 py-2 text-[14px] text-ink"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* 안내 줄 */}
      <p className="mt-4 rounded-lg bg-parchment px-4 py-3 text-[13px] text-ink-muted">
        <span className="mr-2 rounded-pill bg-canvas px-2 py-0.5 text-[12px] font-semibold text-ink">
          배송비 별도
        </span>
        범일금고 본사 정품 · 영등포 직접 설치 · 구매 후 A/S 상담
      </p>

      {/* 그리드 */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
