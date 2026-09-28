import type { NextConfig } from "next";

/**
 * GitHub Pages serves a project site from a sub-path, so the static export has
 * to be built with a matching basePath:
 *
 *   NEXT_PUBLIC_BASE_PATH=/hero3d-landing   (default — repo name based)
 *   NEXT_PUBLIC_BASE_PATH=                 (root of a custom domain)
 *   NEXT_PUBLIC_BASE_PATH=                 (empty -> plain localhost dev)
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/hero3d-landing";

const nextConfig: NextConfig = {
  // Emit a fully static site into ./out — required for GitHub Pages, which can
  // only serve files (no Node server, no ISR, no image optimizer).
  output: "export",
  // Trailing slashes => out/index.html is served for `/` without a server.
  trailingSlash: true,
  basePath,
  // Keep Turbopack scoped to this project (a stray pnpm-workspace.yaml higher up
  // the tree would otherwise pull the whole home directory into the graph).
  turbopack: {
    root: process.cwd(),
  },
  // three ships ESM that benefits from being processed by Next's bundler.
  transpilePackages: ["three"],
  images: {
    // No image optimizer at build time under `output: export`.
    unoptimized: true,
  },
};

export default nextConfig;

