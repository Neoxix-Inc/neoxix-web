import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The default CLI checker cannot parse TypeScript's --showConfig output in this runtime.
  experimental: { useTypeScriptCli: false },
};

export default nextConfig;
