import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: { minimumCacheTTL: 2678400, remotePatterns: [{ protocol: "https", hostname: "asset.somfy.com", pathname: "/Image/**" }] },
  async headers() {
    return [{ source: "/optimized/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }];
  },
  // Native SQLite bindings must stay external to the server bundle.
  serverExternalPackages: ["@libsql/client", "libsql"],
};

export default nextConfig;
