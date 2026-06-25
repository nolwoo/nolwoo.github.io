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

export function KakaoMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!apiKey) return;

    function initMap() {
      if (!containerRef.current) return;
      try {
        const center = new window.kakao.maps.LatLng(LAT, LON);
        const map = new window.kakao.maps.Map(containerRef.current, { center, level: 3 });
        const marker = new window.kakao.maps.Marker({ position: center });
        marker.setMap(map);

        const infoContent = `<div style="padding:8px 12px;font-size:13px;font-family:sans-serif;white-space:nowrap;"><strong>범일금고 영등포대리점</strong><br/><span style="color:#555">영등포로 164</span></div>`;
        const infoWindow = new window.kakao.maps.InfoWindow({ content: infoContent });
        infoWindow.open(map, marker);
      } catch {
        setError("지도를 불러오지 못했습니다.");
      }
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.onload = () => {
      try {
        window.kakao.maps.load(initMap);
      } catch {
        setError("지도를 불러오지 못했습니다.");
      }
    };
    script.onerror = () => setError("지도를 불러오지 못했습니다.");
    document.head.appendChild(script);

    return () => {
      try { document.head.removeChild(script); } catch { /* already removed */ }
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
