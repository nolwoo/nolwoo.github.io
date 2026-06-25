"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

const LAT = 37.5204672;
const LON = 126.8997359;

// 색은 디자인 토큰(globals.css :root)을 참조 — 카카오 오버레이는 raw HTML이라
// Tailwind 클래스가 안 먹으므로 CSS 변수로 토큰을 끌어 쓴다. (임의 hex 금지 규칙)
const INFO_CONTENT = `<div style="padding:8px 12px;font-size:13px;white-space:nowrap;color:var(--color-ink);"><strong>범일금고 영등포대리점</strong><br/><span style="color:var(--color-ink-muted)">영등포로 164</span></div>`;

export function KakaoMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!apiKey) return;

    let cancelled = false;

    function initMap() {
      if (cancelled || !containerRef.current) return;
      try {
        const center = new window.kakao.maps.LatLng(LAT, LON);
        const map = new window.kakao.maps.Map(containerRef.current, { center, level: 3 });
        const marker = new window.kakao.maps.Marker({ position: center });
        marker.setMap(map);

        const infoWindow = new window.kakao.maps.InfoWindow({ content: INFO_CONTENT });
        infoWindow.open(map, marker);
      } catch {
        if (!cancelled) setError("지도를 불러오지 못했습니다.");
      }
    }

    function onload() {
      try {
        window.kakao.maps.load(initMap);
      } catch {
        if (!cancelled) setError("지도를 불러오지 못했습니다.");
      }
    }

    // 1) SDK가 이미 로드돼 있으면 재다운로드 없이 바로 초기화
    if (window.kakao?.maps) {
      onload();
      return () => {
        cancelled = true;
      };
    }

    // 2) 로딩 중인 기존 스크립트가 있으면 재사용, 없으면 새로 추가
    let script = document.querySelector<HTMLScriptElement>("script[data-kakao-map]");
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("data-kakao-map", "true");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
      script.addEventListener("error", () => {
        if (!cancelled) setError("지도를 불러오지 못했습니다.");
      });
      document.head.appendChild(script);
    }
    script.addEventListener("load", onload);

    return () => {
      cancelled = true;
      // 스크립트는 남겨둬 다음 방문 때 SDK 재다운로드를 피한다.
      script?.removeEventListener("load", onload);
    };
  }, []);

  if (!process.env.NEXT_PUBLIC_KAKAO_MAP_KEY) {
    return (
      <div className="flex h-[360px] w-full items-center justify-center rounded-lg bg-parchment sm:h-[440px]">
        <p className="text-[14px] text-ink-faint">지도 API 키가 설정되지 않았습니다.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[360px] w-full items-center justify-center rounded-lg bg-parchment sm:h-[440px]">
        <p className="text-[14px] text-ink-faint">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[360px] w-full sm:h-[440px]"
      aria-label="범일금고 영등포대리점 위치 지도"
    />
  );
}
