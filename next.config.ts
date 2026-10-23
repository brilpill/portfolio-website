import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: { position: "bottom-right" },
  // the Mac's Tailscale name, so the dev server (and its live reload) also works on the PC
  allowedDevOrigins: ["s-macbook-pro.tail8ede7d.ts.net"],
};

export default nextConfig;
