import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "d1ncau8tqf99kp.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "www-cdn.djiits.com",
      },
      {
        protocol: "https",
        hostname: "zoomcorp.com",
      },
      {
        protocol: "https",
        hostname: "www.apple.com",
      },
      {
        protocol: "https",
        hostname: "www.ulanzi.com",
      },
    ],
  },
};

export default nextConfig;
