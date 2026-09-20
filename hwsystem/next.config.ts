import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: { remotePatterns: [{ protocol: "https", hostname: "asset.somfy.com", pathname: "/Image/**" }] },
  // Native SQLite bindings must stay external to the server bundle.
  serverExternalPackages: ["@libsql/client", "libsql"],
};

export default nextConfig;
