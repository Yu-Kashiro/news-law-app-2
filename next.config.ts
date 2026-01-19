import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgu.web.nhk",
      },
    ],
  },
};

export default nextConfig;
