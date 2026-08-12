import { ImageResponse } from "next/og";

export const alt =
  "Bozhidar Ivanov — Fullstack Developer · Gothenburg";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #06080f 0%, #0d1224 45%, #1a2540 100%)",
          color: "#ffffff",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Ambient orb top-left */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: -160,
            left: -160,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(125,211,252,0.28) 0%, transparent 70%)",
          }}
        />
        {/* Ambient orb bottom-right */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: -180,
            right: -180,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 70%)",
          }}
        />

        {/* Top row: BI mark + meta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 84,
              height: 84,
              borderRadius: 20,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              border: "2px solid rgba(255,255,255,0.15)",
              fontSize: 42,
              fontStyle: "italic",
              color: "white",
              letterSpacing: "-2px",
            }}
          >
            BI
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
              fontSize: 15,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
              fontFamily: "monospace",
            }}
          >
            <div style={{ display: "flex" }}>Portfolio · v2</div>
            <div style={{ display: "flex" }}>2026</div>
          </div>
        </div>

        {/* Center: name */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 156,
              lineHeight: 0.9,
              letterSpacing: "-4px",
              fontWeight: 500,
            }}
          >
            Bozhidar
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 156,
              fontStyle: "italic",
              lineHeight: 0.9,
              letterSpacing: "-4px",
              color: "rgba(255,255,255,0.72)",
              fontWeight: 500,
            }}
          >
            Ivanov
          </div>
        </div>

        {/* Bottom: tagline + coords */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              maxWidth: 720,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 32,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.2,
              }}
            >
              Built by discipline. Shaped by code.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 16,
                letterSpacing: "5px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                fontFamily: "monospace",
              }}
            >
              Fullstack Developer · Gothenburg
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
              fontSize: 14,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              fontFamily: "monospace",
            }}
          >
            <div style={{ display: "flex" }}>N 57°42&#39;30&#34;</div>
            <div style={{ display: "flex" }}>E 11°58&#39;05&#34;</div>
          </div>
        </div>

        {/* Live status dot in the very corner */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 96,
            right: 200,
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(52,211,153,0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#34d399",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 11,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#6ee7b7",
              fontFamily: "monospace",
            }}
          >
            Available
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
