import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    dirs: ["src"],
  },
  allowedDevOrigins: ["*"],
  turbopack: {
    rules: {
      "*.svg": { loaders: ["@svgr/webpack"], as: "*.js" },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "54.254.63.231",
        port: "3001",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
    ],
    minimumCacheTTL: 2678400, // 31 days
  },
};

export default nextConfig;
