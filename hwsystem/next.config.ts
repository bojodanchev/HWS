import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native SQLite bindings must stay external to the server bundle.
  serverExternalPackages: ["@libsql/client", "libsql"],
};

export default nextConfig;
