"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, SITE } from "@/lib/site";
import { ConsultButtons } from "./ConsultButtons";

/* Apple global-nav + sub-nav-frosted 혼합 — 슬림·프로스티드·지속 CTA */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // 홈 히어로(풀블리드 사진) 위에서만 헤더를 투명하게 띄운다 — 히어로를 벗어나면 원래대로
  useEffect(() => {
    if (!isHome) return;
    function onScroll() {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // isHome이 아니면 scrolled 값과 무관하게 항상 불투명 헤더
  const transparent = isHome && !scrolled;

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
          transparent
            ? "border-transparent bg-transparent"
            : "border-hairline bg-canvas/80 backdrop-blur-md backdrop-saturate-150"
        }`}
      >
        <div className="mx-auto flex h-[56px] max-w-[1120px] items-center justify-between px-6">
        {/* 로고 */}
        <Link href="/" className="flex items-baseline gap-2">
          <span
            className={`text-[19px] font-bold tracking-[-0.01em] transition-colors ${
              transparent ? "text-white" : "text-ink"
            }`}
          >
            BUMIL
          </span>
          <span
            className={`whitespace-nowrap text-[13px] transition-colors ${
              transparent ? "text-white/75" : "text-ink-faint"
            }`}
          >
            {SITE.brand}{" "}
            <em className={`not-italic transition-colors ${transparent ? "text-white/90" : "text-ink-muted"}`}>
              {SITE.branch}
            </em>
          </span>
        </Link>

        {/* 데스크톱 내비 */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-sm px-3 py-2 text-[14px] transition-colors ${
                transparent ? "text-white/85 hover:text-white" : "text-ink-muted hover:text-blue"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 데스크톱 상담 CTA */}
        <div className="hidden lg:block">
          <ConsultButtons size="sm" phoneOutline onDark={transparent} />
        </div>

        {/* 모바일 햄버거 */}
        <button
          className="lg:hidden flex flex-col gap-[5px] p-2"
          aria-label="메뉴 열기"
          onClick={() => setOpen(true)}
        >
          <span className={`h-[2px] w-[22px] rounded transition-colors ${transparent ? "bg-white" : "bg-ink"}`} />
          <span className={`h-[2px] w-[22px] rounded transition-colors ${transparent ? "bg-white" : "bg-ink"}`} />
          <span className={`h-[2px] w-[22px] rounded transition-colors ${transparent ? "bg-white" : "bg-ink"}`} />
        </button>
        </div>
      </header>

      {/* 모바일 드로어 — 헤더 밖에 둔다.
         헤더의 backdrop-filter가 안쪽 fixed 요소의 기준(containing block)이 되어버려
         드로어가 헤더 박스 안에 갇히는 문제를 피하기 위함. */}
      {open && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-[60] bg-black/35"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed right-0 top-0 z-[70] flex h-full w-[80vw] max-w-[320px] flex-col gap-1 border-l border-hairline bg-canvas p-6">
            <button
              className="self-end p-2 text-2xl leading-none text-ink-faint"
              aria-label="닫기"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-sm px-3 py-3.5 text-[16px] font-medium text-ink hover:text-blue"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3">
              <ConsultButtons
                size="md"
                phoneOutline
                className="flex-col items-stretch [&>a]:w-full"
              />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
