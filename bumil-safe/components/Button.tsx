import { ReactNode } from "react";
import Link from "next/link";

/* 프리미엄 버튼 문법 — 잉크 pill(액션) / 라이트(다크 면 위) / kakao(기능색 예외) */
type Variant = "primary" | "ghost" | "dark" | "kakao" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap " +
  "transition-transform duration-150 active:scale-95 select-none";

// 아웃라인 알약 — 고스트·카카오 공용 (조용한 톤, 채움 없음)
const outlinePill =
  "bg-transparent text-ink border border-ink/25 rounded-pill hover:border-ink hover:bg-pearl";

const variants: Record<Variant, string> = {
  // 잉크 알약 — 1차 액션 (프리미엄 톤)
  primary: "bg-ink text-white rounded-pill hover:bg-black",
  // 고스트 알약 — 두 번째 CTA
  ghost: outlinePill,
  // 다크 유틸 — 8px 라운드
  dark: "bg-ink text-white rounded-sm hover:bg-black",
  // 카카오 — 기능색 예외. 배경은 아웃라인으로 조용히, 브랜드 인지는 아이콘 색으로만
  kakao: outlinePill,
  // 라이트 알약 — 다크 타일 위의 1차 액션
  light: "bg-white text-ink rounded-pill hover:bg-parchment",
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
