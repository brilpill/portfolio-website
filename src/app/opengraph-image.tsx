import { ImageResponse } from "next/og";

export const alt = "Oleh Bril — UX/UI Designer & Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 84px", background: "#f8f9fc", color: "#191a1d" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22 }}><span style={{ width: 12, height: 12, borderRadius: 12, background: "#1465ff" }} />Currently open for work</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ fontFamily: "serif", fontSize: 94, letterSpacing: -4 }}>Hi! I’m Oleh Bril</div>
        <div style={{ fontSize: 32 }}>UX/UI Designer &amp; Engineer · Warsaw</div>
      </div>
      <div style={{ color: "#525765", fontSize: 25 }}>I design how products look, move and feel, and I build them that way.</div>
    </div>,
    size,
  );
}
