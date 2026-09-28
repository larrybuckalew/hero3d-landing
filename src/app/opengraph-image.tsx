import { ImageResponse } from "next/og";

export const alt = "Helio — the AI ops copilot for modern teams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(120% 90% at 78% 0%, #1b1440 0%, #0a0c1f 48%, #04050c 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "linear-gradient(135deg, #c4f24a, #22d3ee 55%, #7c5cff)",
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 700 }}>Helio</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            Ship at the speed of
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              backgroundImage: "linear-gradient(96deg, #c4f24a, #22d3ee)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            your best engineer
          </div>
          <div style={{ fontSize: 28, color: "rgba(232,236,248,0.65)" }}>
            The AI ops copilot that finds the bug, writes the fix, opens the PR.
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, fontSize: 22, color: "rgba(232,236,248,0.55)" }}>
          <div>SOC 2 Type II</div>
          <div>14-day trial</div>
          <div>No credit card</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
