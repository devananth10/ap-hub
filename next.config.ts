import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

// Allow HMR from this computer's private IPv4 addresses, without a wildcard origin.
const localNetworkHosts = Object.values(networkInterfaces()).flatMap((addresses) =>
  (addresses ?? []).filter(({ family, internal, address }) =>
    family === "IPv4" && !internal && /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(address)
  ).map(({ address }) => address)
);
const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1", ...localNetworkHosts],
  // Keep the live development preview separate from production build output.
  distDir: process.env.NODE_ENV === "development" ? ".next-preview" : ".next",
};
export default nextConfig;
