import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "assets1.cleartax-cdn.com",
      "taxlegit.com",
      "www.bigfootdigital.co.uk", // ← add this
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.bigfootdigital.co.uk",
      },
    ],
  },
};

export default nextConfig;
