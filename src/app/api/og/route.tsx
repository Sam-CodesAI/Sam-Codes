import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Intelligent Digital Systems & Autonomous Workflows";
    const category = searchParams.get("category") || "DIGITAL LAB";

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
          {/* Radial Glows */}
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

          {/* Top Bar */}
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
                SAM CODES // {category.toUpperCase()}
              </span>
            </div>

            <span
              style={{
                color: "#94a3b8",
                fontSize: "13px",
                fontFamily: "monospace",
              }}
            >
              sam-codes.vercel.app
            </span>
          </div>

          {/* Center */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "960px",
            }}
          >
            <h1
              style={{
                fontSize: "54px",
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              {title}
            </h1>

            <p
              style={{
                fontSize: "22px",
                color: "#94a3b8",
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              Samarth Nimangre — AI Developer &amp; Automation Engineer. Tested production code with verified blueprints.
            </p>
          </div>

          {/* Bottom */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", gap: "28px", fontFamily: "monospace", fontSize: "13px" }}>
              <span style={{ color: "#38bdf8" }}>[PROVEN] ZERO FABRICATION</span>
              <span style={{ color: "#34d399" }}>[FAST] SUB-2S LOAD TIME</span>
              <span style={{ color: "#a78bfa" }}>[CLEAN] PRODUCTION VERIFIED</span>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              {["Next.js 16", "TypeScript", "Supabase", "AI Workflows"].map((t) => (
                <span
                  key={t}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    color: "#cbd5e1",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    console.error("OG Image generation failed:", err);
    return new Response("Failed to generate image", { status: 500 });
  }
}
