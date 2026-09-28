import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Turbopack scoped to this project (a stray pnpm-workspace.yaml higher up
  // the tree would otherwise pull the whole home directory into the graph).
  turbopack: {
    root: process.cwd(),
  },
  // three ships ESM that benefits from being processed by Next's bundler.
  transpilePackages: ["three"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

