import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (~50% smaller than WebP for line art), fall back to WebP, then PNG
    formats: ["image/avif", "image/webp"],
    // Generous size ladder for high-res hero engravings on retina displays
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3200, 3840],
  },
};

export default nextConfig;
