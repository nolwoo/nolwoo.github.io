import Link from "next/link";
import type { Product } from "@/lib/products";

export function ColorSwatches({
  variants,
  currentId,
}: {
  variants: { product: Product; color: string }[];
  currentId: string;
}) {
  if (variants.length < 2) return null;

  return (
    <div className="mt-6 border-t border-hairline pt-6">
      <p className="text-[14px] text-ink-faint">
        색상 선택 ({variants.length}종)
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {variants.map(({ product: v, color }) => (
          <Link
            key={v.id}
            href={`/products/${v.id}`}
            aria-current={v.id === currentId}
            title={color}
            className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 pr-3 transition-colors ${
              v.id === currentId
                ? "border-ink"
                : "border-hairline hover:border-ink-faint"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={v.img}
              alt=""
              className="h-9 w-9 shrink-0 rounded bg-parchment object-cover"
            />
            <span className="text-[13px] text-ink">{color}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
