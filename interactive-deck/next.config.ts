import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * The app is a subdirectory of the DRK repository, so Next's lockfile-based
   * root inference can wander up past the repo and pick an unrelated lockfile.
   * Pin the tracing root to this directory — it is the whole deployable unit.
   */
  outputFileTracingRoot: path.join(__dirname),
  /**
   * A production build and a running dev server cannot share `.next` — the dev
   * server rewrites chunks under the build's feet and page collection fails with
   * a missing-module error. Setting DRK_DIST_DIR lets QA build to a separate
   * directory while the dev server keeps serving.
   */
  distDir: process.env.DRK_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    // Object plates are used at a handful of discrete sizes; keep the
    // generated set small so the optimiser cache stays cheap.
    deviceSizes: [390, 768, 1024, 1366, 1440, 1920, 2560],
    imageSizes: [96, 128, 192, 256, 320, 420, 560, 720, 960],
  },
  experimental: {
    optimizePackageImports: ["motion"],
  },
};

export default nextConfig;
