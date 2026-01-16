import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "SMB Voice - Professional Business Phone for $7.95/month";
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
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo/Icon Area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 20,
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            SMB Voice
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "#94a3b8",
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          Professional Business Phone System
        </div>

        {/* Price Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            padding: "16px 40px",
            borderRadius: 16,
            marginBottom: 30,
          }}
        >
          <span
            style={{
              fontSize: 24,
              color: "white",
              marginRight: 4,
            }}
          >
            $
          </span>
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "white",
            }}
          >
            7.95
          </span>
          <span
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.8)",
              marginLeft: 8,
            }}
          >
            /month
          </span>
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: 40,
            color: "#e2e8f0",
            fontSize: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#10b981" }}>✓</span> Local Number
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#10b981" }}>✓</span> Voicemail
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#10b981" }}>✓</span> Call Forwarding
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#10b981" }}>✓</span> SMS
          </div>
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            fontSize: 22,
            color: "#64748b",
          }}
        >
          voice.startmybusiness.us
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
