import { ImageResponse } from "next/og";

export const alt = "Bali Handmade, wholesale 925 sterling silver beads and findings";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social share card rendered at build time.
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
          background: "linear-gradient(135deg, #241a13 0%, #1b130d 100%)",
          color: "#f5efe2",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#c8a061",
          }}
        >
          Wholesale 925 Sterling Silver
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 132, fontWeight: 600, lineHeight: 1 }}>
            Bali Handmade
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 38,
              color: "#d9cfbd",
              maxWidth: 900,
            }}
          >
            Handmade beads, charms and findings from Bali since 2004.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#b8aa92",
          }}
        >
          <div style={{ display: "flex" }}>Wholesale pricing for everyone</div>
          <div style={{ display: "flex", color: "#c8a061" }}>bali-handmade.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
