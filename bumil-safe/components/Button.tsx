import { ReactNode } from "react";
import Link from "next/link";

/* 프리미엄 버튼 문법 — 잉크 pill(액션) / 라이트(다크 면 위) / kakao(기능색 예외) */
type Variant = "primary" | "ghost" | "ghost-dark" | "dark" | "kakao" | "kakao-dark" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap " +
  "transition-transform duration-150 active:scale-95 select-none " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

// 포커스 링 색 — 밝은 면 위는 잉크, 다크 면 위는 밝은 색이어야 보인다(대비 3:1 확보)
const focusOnLight = "focus-visible:outline-blue-focus";
const focusOnDark = "focus-visible:outline-blue-on-dark";

// 아웃라인 알약 — 고스트·카카오 공용 (조용한 톤, 채움 없음)
const outlinePill =
  "bg-transparent text-ink border border-ink/25 rounded-pill hover:border-ink hover:bg-pearl";
// 아웃라인 알약(다크 면 위) — 사진 위·다크 타일 위에서 쓰는 밝은 버전
const outlinePillDark =
  "bg-transparent text-white border border-white/35 rounded-pill hover:border-white hover:bg-white/10";

const variants: Record<Variant, string> = {
  // 잉크 알약 — 1차 액션 (프리미엄 톤)
  primary: `bg-ink text-white rounded-pill hover:bg-black ${focusOnLight}`,
  // 고스트 알약 — 두 번째 CTA
  ghost: `${outlinePill} ${focusOnLight}`,
  "ghost-dark": `${outlinePillDark} ${focusOnDark}`,
  // 다크 유틸 — 8px 라운드
  dark: `bg-ink text-white rounded-sm hover:bg-black ${focusOnLight}`,
  // 카카오 — 기능색 예외. 배경은 아웃라인으로 조용히, 브랜드 인지는 아이콘 색으로만.
  // ghost/ghost-dark와 값이 항상 같아야 한다(이름만 분리 — ConsultButtons.tsx에서
  // 어떤 버튼인지 구분하기 위함). 아웃라인 톤을 바꿀 땐 outlinePill(Dark) 쪽만 고치면 된다.
  kakao: `${outlinePill} ${focusOnLight}`,
  "kakao-dark": `${outlinePillDark} ${focusOnDark}`,
  // 라이트 알약 — 다크 타일 위의 1차 액션 (버튼은 밝지만 다크 배경 위라 링도 밝은 색 유지)
  light: `bg-white text-ink rounded-pill hover:bg-parchment ${focusOnDark}`,
};

const sizes: Record<Size, string> = {
  sm: "text-[14px] px-4 py-2",
  md: "text-[15px] px-5 py-2.5",
  lg: "text-[17px] px-7 py-3.5",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  ...rest
}: CommonProps &
  ({ href: string } | { href?: undefined }) &
  React.ComponentPropsWithoutRef<"a">) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  // 내부 경로는 next/link, 외부/tel/이벤트는 a
  if (href && href.startsWith("/")) {
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...rest}>
      {children}
    </a>
  );
}
