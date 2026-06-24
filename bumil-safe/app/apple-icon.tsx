import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 21,
            fontWeight: 900,
            color: "#1d1d1f",
            letterSpacing: "-0.5px",
            fontFamily: "sans-serif",
          }}
        >
          BUMILSAFE
        </span>
      </div>
    ),
    { ...size },
  );
}
