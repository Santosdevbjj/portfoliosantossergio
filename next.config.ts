import type { NextConfig } from "next";

/**
 * NEXT.JS 16 & NODE 24 CONFIGURATION — SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * Fix: Removida chave 'eslint' (Depreciada no Next 16)
 * Fix: Ajustada tipagem para conformidade com TS 6.0
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Habilita suporte a pacotes que exigem Node.js nativo (Node 24)
  serverExternalPackages: ["@microsoft/applicationinsights-web"], 

  experimental: {
    // Performance: Carregamento seletivo de bibliotecas pesadas
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
      "date-fns"
    ],
    // Segurança e Data Fetching (React 19 / Next 16)
    taint: true, 
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.medium.com',
      }
    ],
    minimumCacheTTL: 60,
  },

  // Mantido para garantir integridade do código no build
  typescript: {
    ignoreBuildErrors: false,
  },

  /**
   * NOTA: A chave 'eslint' foi removida. 
   * Para desativar o lint no build, use 'next build --no-lint' no package.json
   */

  poweredByHeader: false, 
  compress: true,        
};

export default nextConfig;
