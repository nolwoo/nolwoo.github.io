import { ReactNode } from "react";

/** 본문 최대폭 컨테이너 (Apple: 텍스트 ~980px, 그리드 ~1120px) */
export function Container({
  children,
  className = "",
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  const max =
    size === "narrow"
      ? "max-w-[980px]"
      : size === "wide"
        ? "max-w-[1440px]"
        : "max-w-[1120px]";
  return (
    <div className={`${max} mx-auto px-6 ${className}`}>{children}</div>
  );
}
