import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "SAM CODES — Intelligent Digital Systems & Autonomous Workflows";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          backgroundColor: "#06080f",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient background glows */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%)",
          }}
        />

        {/* Top Bar: Brand Pill & Live Status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#38bdf8",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                fontFamily: "monospace",
                color: "#38bdf8",
                letterSpacing: "0.15em",
                fontWeight: 700,
              }}
            >
              SAM CODES // DIGITAL LAB
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "9999px",
              backgroundColor: "rgba(56, 189, 248, 0.08)",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              color: "#e2e8f0",
              fontSize: "13px",
              fontFamily: "monospace",
            }}
          >
            <span>sam-codes.vercel.app</span>
          </div>
        </div>

        {/* Center: Main Headline & Role */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "960px",
          }}
        >
          <h1
            style={{
              fontSize: "58px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Intelligent Digital Systems &amp; Autonomous Workflows
          </h1>

          <p
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Samarth Nimangre — AI Developer &amp; Automation Engineer. Building custom conversational agents, edge webhook bridges, and modern web architectures.
          </p>
        </div>

        {/* Bottom Bar: Engineering Guarantees & Tech Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Engineering Standards */}
          <div style={{ display: "flex", gap: "28px", fontFamily: "monospace", fontSize: "13px" }}>
            <span style={{ color: "#38bdf8" }}>[PROVEN] ZERO FABRICATION</span>
            <span style={{ color: "#34d399" }}>[FAST] SUB-2S PERFORMANCE</span>
            <span style={{ color: "#a78bfa" }}>[CLEAN] MODULAR ARCHITECTURE</span>
          </div>

          {/* Tech Badges */}
          <div style={{ display: "flex", gap: "10px" }}>
            {["Next.js 16", "React 19", "TypeScript", "Supabase", "AI Agents"].map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  color: "#cbd5e1",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
