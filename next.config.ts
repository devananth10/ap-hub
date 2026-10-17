import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  devIndicators: false,
  // Keep the live development preview separate from production build output.
  distDir: process.env.NODE_ENV === "development" ? ".next-preview" : ".next",
};
export default nextConfig;
