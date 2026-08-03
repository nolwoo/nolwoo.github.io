"use client";

import { useEffect, useState } from "react";

type Slide = { img: string; alt: string; title: string; desc: string };

const SLIDES: Slide[] = [
  {
    img: "/hero-product.webp",
    alt: "거실에 놓인 범일금고 OARCFX 스마트 금고 3종",
    title: "소중한 것을 가장 안전하게",
    desc: "범일금고 본사 정품을 영등포에서. 가정부터 사무실까지, 꼭 맞는 금고를 상담해 드립니다.",
  },
  {
    img: "/service-office.webp",
    alt: "범일금고 STELTH 스텔스 스마트 금고 2종",
    title: "사무실 자산도 든든하게",
    desc: "대형·이중잠금 스마트 금고까지, 사무 공간에 맞는 모델을 폭넓게 갖췄습니다.",
  },
  {
    img: "/service-home.webp",
    alt: "범일금고 월넛우드패널 스마트 금고",
    title: "공간을 해치지 않는 디자인",
    desc: "월넛 우드 패널부터 새틴 글라스까지, 인테리어에 자연스럽게 스며드는 소재로 골라보세요.",
  },
  {
    img: "/about-service.webp",
    alt: "범일금고 LUSTER 러스터 스마트 금고 3종",
    title: "은은한 광택의 프리미엄 라인업",
    desc: "컬러 스테인리스 패널로 완성한 러스터 시리즈, 실물로 확인해 보세요.",
  },
  {
    img: "/philosophy-moire.webp",
    alt: "범일금고 MOIRE 모아르 스마트 금고",
    title: "매일의 안심을 곁에 두는 일",
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
    <div className="relative h-[420px] w-full overflow-hidden rounded-lg sm:h-[520px]">
      {SLIDES.map((s, i) => (
        <img
          key={s.img}
          src={s.img}
          alt={s.alt}
          // 첫 장은 LCP 대상이라 우선 로드, 나머지는 뒤로 미뤄 첫 화면 속도를 지킨다
          fetchPriority={i === 0 ? "high" : "low"}
          decoding={i === 0 ? "sync" : "async"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-tile/90 to-transparent" />

      {/* 좌우 화살표 */}
      <button
        onClick={() => go(index - 1)}
        aria-label="이전 사진"
        className="absolute left-3 top-[40%] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label="다음 사진"
        className="absolute right-3 top-[40%] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* 자동재생 정지/재생 — 모션에 민감한 사용자를 위한 접근성 컨트롤 */}
      <button
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "자동 슬라이드 재생" : "자동 슬라이드 정지"}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
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

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-8 text-center sm:p-12">
        {/* 슬라이드마다 바뀌는 문구라 h1이 아닌 h2 — 페이지 대표 h1은 캐러셀 위에 고정으로 둔다 */}
        <h2 className="mx-auto max-w-[16ch] text-[clamp(28px,5vw,48px)] font-semibold leading-[1.22] text-on-dark">
          {active.title}
        </h2>
        <p className="mx-auto mt-4 max-w-[44ch] text-[clamp(15px,1.8vw,18px)] leading-relaxed text-on-dark-muted">
          {active.desc}
        </p>

        {/* 점 인디케이터 */}
        <div className="pointer-events-auto mt-6 flex justify-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.img}
              onClick={() => go(i)}
              aria-label={`${i + 1}번째 사진 보기`}
              aria-current={i === index}
              className={`h-1.5 rounded-pill transition-all ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
