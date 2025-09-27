// next.config.ts
import type { NextConfig } from "next";

const repo = "multi-portfolio";                    // <-- CHANGE to your repo name
const isProd = process.env.NODE_ENV === "production";
const subdir = process.env.NEXT_PUBLIC_SUBDIR || ""; // e.g. "unit1" during export

const base = isProd ? `/${repo}${subdir ? `/${subdir}` : ""}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: base,
  assetPrefix: base + "/",
  images: { unoptimized: true },
  trailingSlash: true
};

export default nextConfig;
