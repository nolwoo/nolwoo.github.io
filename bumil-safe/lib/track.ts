// 상담 전환 추적 — "노출이 실제 상담으로 이어지는가"를 GA4에서 확인하기 위한 공통 이벤트.
// gtag는 app/layout.tsx의 <GoogleAnalytics>가 전역에 올려둔다. 없으면 조용히 무시한다.
export function trackConsult(method: "kakao" | "phone", location = "page") {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  gtag?.("event", "consult_click", { method, location });
}
