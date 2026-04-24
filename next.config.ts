import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cho phép load ảnh từ domain bên ngoài (dùng khi crawl)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Cho phép SVG placeholder
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
