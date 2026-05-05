import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@atelier/ui"],
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
