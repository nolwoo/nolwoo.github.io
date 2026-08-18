"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HEADER_HEIGHT_PX, NAV, SITE } from "@/lib/site";
import { ConsultButtons } from "./ConsultButtons";

/* Apple global-nav + sub-nav-frosted 혼합 — 슬림·프로스티드·지속 CTA */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const drawerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // 홈 히어로(풀블리드 사진) 위에서만 헤더를 투명하게 띄운다 — 히어로를 완전히
  // 벗어나면(= #home-hero가 헤더 아래로 안 보이면) 원래대로. 스크롤 위치를 어림잡는
  // 대신 IntersectionObserver로 히어로 자체를 관찰해 -mt-14 같은 레이아웃 변화에도
  // 어긋나지 않게 한다.
  useEffect(() => {
    if (!isHome) return;
    const hero = document.getElementById("home-hero");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: `-${HEADER_HEIGHT_PX}px 0px 0px 0px`, threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [isHome]);

  // isHome이 아니면 scrolled 값과 무관하게 항상 불투명 헤더
  const transparent = isHome && !scrolled;

  // 모바일 드로어 — 열리면 포커스 이동·트랩, ESC로 닫기, 닫히면 햄버거 버튼으로 포커스 복귀
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const focusables = drawer?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    const first = focusables?.[0];
    const last = focusables?.[focusables.length - 1];
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
          transparent
            ? "border-transparent bg-transparent"
            : "border-hairline bg-canvas/80 backdrop-blur-md backdrop-saturate-150"
        }`}
      >
        {/* 높이는 HEADER_HEIGHT_PX(lib/site.ts)와 같은 값(56px)으로 맞춰둘 것 —
            HeroCarousel의 음수 마진·IntersectionObserver 계산이 이 값을 전제로 한다 */}
        <div className="mx-auto flex h-[56px] max-w-[1120px] items-center justify-between px-6">
        {/* 로고 */}
        <Link href="/" className="flex items-baseline gap-2">
          <span
            className={`text-[19px] font-bold tracking-[-0.01em] transition-colors ${
              transparent ? "text-on-dark" : "text-ink"
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
              aria-current={pathname === item.href ? "page" : undefined}
              className={`rounded-sm px-3 py-2 text-[14px] transition-colors ${
                transparent ? "text-white/85 hover:text-on-dark" : "text-ink-muted hover:text-blue"
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
          ref={menuButtonRef}
          className="lg:hidden flex flex-col gap-[5px] p-2"
          aria-label="메뉴 열기"
          aria-expanded={open}
          aria-controls="mobile-nav-drawer"
          onClick={() => setOpen(true)}
        >
          <span className={`h-[2px] w-[22px] rounded transition-colors ${transparent ? "bg-on-dark" : "bg-ink"}`} />
          <span className={`h-[2px] w-[22px] rounded transition-colors ${transparent ? "bg-on-dark" : "bg-ink"}`} />
          <span className={`h-[2px] w-[22px] rounded transition-colors ${transparent ? "bg-on-dark" : "bg-ink"}`} />
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
          <aside
            id="mobile-nav-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="메뉴"
            className="fixed right-0 top-0 z-[70] flex h-full w-[80vw] max-w-[320px] flex-col gap-1 border-l border-hairline bg-canvas p-6"
          >
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
                aria-current={pathname === item.href ? "page" : undefined}
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
