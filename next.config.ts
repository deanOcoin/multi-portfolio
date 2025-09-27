// next.config.ts
import type { NextConfig } from "next";

const repo = "multi-portfolio";                 // <-- your repo name
const isProd = process.env.NODE_ENV === "production";
const subdir = process.env.NEXT_PUBLIC_SUBDIR || ""; // e.g. "unit1"

const base = isProd ? `/${repo}${subdir ? `/${subdir}` : ""}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: base,
  assetPrefix: base + "/",
  images: { unoptimized: true },
  trailingSlash: true,
  turbopack: { root: __dirname } // silences the workspace-root warning
  // If lint ever blocks builds again:
  // eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
