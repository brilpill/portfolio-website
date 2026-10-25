import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The development badge overlaps the assistant's Send control on the right edge.
  devIndicators: false,
  // the Mac's Tailscale name, so the dev server (and its live reload) also works on the PC
  allowedDevOrigins: ["s-macbook-pro.tail8ede7d.ts.net"],
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ] }];
  },
};

export default nextConfig;
