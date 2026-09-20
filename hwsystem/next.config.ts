import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "asset.somfy.com", pathname: "/Image/**" }] },
  // Native SQLite bindings must stay external to the server bundle.
  serverExternalPackages: ["@libsql/client", "libsql"],
};

export default nextConfig;
