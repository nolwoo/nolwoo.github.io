import { ReactNode } from "react";
import Link from "next/link";

/* Apple 버튼 문법 — pill(액션) / dark-utility(8px) / kakao(기능색 예외) */
type Variant = "primary" | "ghost" | "dark" | "kakao";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap " +
  "transition-transform duration-150 active:scale-95 select-none";

const variants: Record<Variant, string> = {
  // 블루 알약 — 유일한 1차 액션
  primary: "bg-blue text-white rounded-pill hover:bg-blue-focus",
  // 고스트 알약 — 두 번째 CTA
  ghost:
    "bg-transparent text-blue border border-blue rounded-pill hover:bg-pearl",
  // 다크 유틸 — 8px 라운드
  dark: "bg-ink text-white rounded-sm hover:bg-black",
  // 카카오 — 기능색 예외, pill 문법 유지
  kakao:
    "bg-kakao text-kakao-ink rounded-pill hover:brightness-95",
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
