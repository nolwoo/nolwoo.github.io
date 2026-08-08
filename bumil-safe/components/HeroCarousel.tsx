"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { HEADER_HEIGHT_PX } from "@/lib/site";

type Slide = { img: string; alt: string; title: ReactNode; desc: ReactNode };

const SLIDES: Slide[] = [
  {
    img: "/hero-product.webp",
    alt: "거실에 놓인 범일금고 OARCFX 스마트 금고 3종",
    title: "소중한 것을 가장 안전하게",
    desc: (
      <>
        범일금고 본사 정품을 영등포에서.
        <br />
        가정부터 사무실까지, 꼭 맞는 금고를 상담해 드립니다.
      </>
    ),
  },
  {
    img: "/service-office.webp",
    alt: "범일금고 STELTH 스텔스 스마트 금고 2종",
    title: "사무실 자산도 든든하게",
    desc: (
      <>
        대형·이중잠금 스마트 금고까지,
        <br />
        사무 공간에 맞는 모델을 폭넓게 갖췄습니다.
      </>
    ),
  },
  {
    img: "/service-home.webp",
    alt: "범일금고 월넛우드패널 스마트 금고",
    title: "공간을 해치지 않는 디자인",
    desc: (
      <>
        월넛 우드 패널부터 새틴 글라스까지,
        <br />
        인테리어에 자연스럽게 스며드는 소재로 골라보세요.
      </>
    ),
  },
  {
    img: "/about-service.webp",
    alt: "범일금고 LUSTER 러스터 스마트 금고 3종",
    title: (
      <>
        은은한 광택의
        <br />
        프리미엄 라인업
      </>
    ),
    desc: (
      <>
        컬러 스테인리스 패널로 완성한
        <br />
        러스터 시리즈, 실물로 확인해 보세요.
      </>
    ),
  },
  {
    img: "/philosophy-moire.webp",
    alt: "범일금고 MOIRE 모아르 스마트 금고",
    title: (
      <>
        매일의
        <br />
        안심을 곁에 두는 일
      </>
    ),
    desc: "무엇을 지킬 것인가 — 범일금고가 오래도록 고민해 온 질문입니다.",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, index]);

  function go(i: number) {
    setIndex((i + SLIDES.length) % SLIDES.length);
  }

  const active = SLIDES[index];

  return (
    <div
      // 헤더(HEADER_HEIGHT_PX, sticky) 아래로 음수 마진을 줘서 사진이 헤더 뒤까지 이어지게
      // 한다 — 헤더는 홈 최상단에서 투명해져 사진 위에 떠 있는 것처럼 보인다.
      // id는 Header.tsx가 IntersectionObserver로 "히어로를 벗어났는지" 판단하는 기준.
      id="home-hero"
      style={{ marginTop: -HEADER_HEIGHT_PX }}
      className="relative h-[100dvh] w-full overflow-hidden"
      role="region"
      aria-roledescription="캐러셀"
      aria-label="대표 제품 사진"
    >
      {SLIDES.map((s, i) => (
        <img
          key={s.img}
          src={s.img}
          alt={s.alt}
          // 보이지 않는 슬라이드는 스크린리더에서도 감춘다 (안 그러면 5장 설명이 모두 읽힘)
          aria-hidden={i !== index}
          // 첫 장은 LCP 대상이라 우선 로드, 나머지는 뒤로 미뤄 첫 화면 속도를 지킨다
          fetchPriority={i === 0 ? "high" : "low"}
          decoding={i === 0 ? "sync" : "async"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* 왼쪽 텍스트 구역만 어둡게 — 오른쪽 제품은 그대로 선명하게 */}
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/25 to-transparent" />
      {/* 상단(헤더가 얹히는 구간)도 살짝 어둡게 해 로고·내비 대비를 보장 */}
      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/40 to-transparent" />

      {/* 우측 세로 인디케이터 */}
      <div className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-3 sm:right-10">
        {SLIDES.map((s, i) => (
          <button
            key={s.img}
            onClick={() => go(i)}
            aria-label={`${i + 1}번째 사진 보기`}
            aria-current={i === index}
            className={`w-1.5 rounded-pill transition-all ${
              i === index ? "h-6 bg-on-dark" : "h-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* 자동재생 정지/재생 — 모션에 민감한 사용자를 위한 접근성 컨트롤 */}
      <button
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "자동 슬라이드 재생" : "자동 슬라이드 정지"}
        style={{ top: HEADER_HEIGHT_PX + 20 }}
        className="absolute right-6 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-on-dark backdrop-blur-sm transition-colors hover:bg-black/50 sm:right-10"
      >
        {paused ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
          </svg>
        )}
      </button>

      {/* pointer-events-none — 이 박스는 콘텐츠보다 넓어서(특히 모바일 전체폭) 우측
          인디케이터·정지 버튼과 자리가 겹칠 수 있다. 안의 링크만 다시 클릭 가능하게 켠다. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-5 p-8 sm:max-w-[560px] sm:p-16">
        {/* 페이지 대표 제목(h1) — 슬라이드와 무관하게 고정, 검색엔진에 지역·업종을 명시 */}
        <h1 className="text-[13px] font-semibold uppercase tracking-[0.3em] text-white/80">
          Bumil Safe · 영등포 금고 전문점
        </h1>
        {/* 슬라이드마다 바뀌는 문구라 h1이 아닌 h2 */}
        <h2 className="max-w-[14ch] text-[clamp(30px,5.5vw,56px)] font-semibold leading-[1.2] text-on-dark">
          {active.title}
        </h2>
        <p className="max-w-[40ch] text-[clamp(15px,1.8vw,18px)] leading-relaxed text-white/80">
          {active.desc}
        </p>
        {/* 상시 CTA는 헤더가 담당 — 히어로에는 가벼운 링크 하나만 */}
        <Link
          href="/contact"
          className="pointer-events-auto mt-2 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-[15px] text-on-dark transition-colors hover:border-on-dark"
        >
          상담 안내 보기
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
