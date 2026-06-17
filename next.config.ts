import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Permite acesso via rede local para HMR (Hot Module Replacement) */
  // @ts-ignore - allowedDevOrigins is required for local network HMR but might not be in the current NextConfig type
  allowedDevOrigins: ['192.168.1.6', 'localhost:3000', '192.168.1.6:3000'],
};

export default nextConfig;
