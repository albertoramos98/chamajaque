import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Permite acesso via rede local para HMR (Hot Module Replacement) */
  allowedDevOrigins: ['localhost:3000', '192.168.1.6', '192.168.1.6:3000', '192.168.1.97', '192.168.1.97:3000'],
};

export default nextConfig;
