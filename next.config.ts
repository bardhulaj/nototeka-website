import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; frame-ancestors 'none';",
  },
];

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (~50% smaller than WebP for line art), fall back to WebP, then PNG
    formats: ["image/avif", "image/webp"],
    // Generous size ladder for high-res hero engravings on retina displays
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3200, 3840],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
