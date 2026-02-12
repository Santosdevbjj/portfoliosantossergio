import type { NextConfig } from "next";

/**
 * NEXT.JS 16 & NODE 24 CONFIGURATION — SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * Estabilidade: Node 24.x (LTS Ready)
 * Compilador: Turbopack + TS 6.0 Go-Engine Compatibility
 * Otimização: Imagens AVIF & Segurança de Headers
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Habilita suporte a pacotes que exigem Node.js nativo (Node 24)
  // Essencial para manter a performance de telemetria e análise
  serverExternalPackages: ["@microsoft/applicationinsights-web"], 

  experimental: {
    // Essencial para o Next 16: Reduz o bundle enviando apenas o que é usado
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
      "date-fns"
    ],
    // Habilita proteção contra vazamento de dados sensíveis (React 19)
    taint: true, 
  },

  images: {
    /**
     * AVIF é o padrão ouro em 2026. 
     * O Node 24 gerencia o encoder Sharp com muito mais eficiência de memória.
     */
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
    dangerouslyAllowSVG: true, // Útil para ícones externos de tecnologia
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Rigor do TS 6.0: Garante que o build pare se houver erros de tipagem
  typescript: {
    ignoreBuildErrors: false,
  },

  // Segurança e Performance
  poweredByHeader: false, 
  compress: true,        
};

export default nextConfig;
