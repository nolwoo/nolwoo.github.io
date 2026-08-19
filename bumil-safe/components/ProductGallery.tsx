"use client";

import { useState } from "react";

export function ProductGallery({
  images,
  alt,
  best,
}: {
  images: string[];
  alt: string;
  best?: boolean;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex items-center justify-center rounded-lg bg-parchment p-10">
        {best && (
          <span className="absolute left-5 top-5 rounded-pill bg-ink px-3 py-1 text-[12px] font-semibold text-white">
            BEST
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current}
          alt={alt}
          className="w-full max-w-[420px] [filter:drop-shadow(0_5px_30px_rgba(0,0,0,0.22))]"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${alt} 사진 ${i + 1}`}
              aria-current={i === active}
              className={`h-16 w-16 shrink-0 rounded-lg border bg-parchment p-1.5 transition-colors ${
                i === active
                  ? "border-ink"
                  : "border-hairline hover:border-ink-faint"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
