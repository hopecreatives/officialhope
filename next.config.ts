import type { NextConfig } from "next";

const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";
const githubRepository = process.env.GITHUB_REPOSITORY ?? "";
const repositoryName = githubRepository.split("/")[1] ?? "";
const basePath =
  isGithubPagesBuild && repositoryName ? `/${repositoryName}` : undefined;

const nextConfig: NextConfig = {
  output: isGithubPagesBuild ? "export" : undefined,
  trailingSlash: isGithubPagesBuild,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: isGithubPagesBuild,
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
