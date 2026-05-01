import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "pub-8cc574bebece4efaba6f4b5daacb0854.r2.dev",
      },
    ],
  },
};

export default nextConfig;
