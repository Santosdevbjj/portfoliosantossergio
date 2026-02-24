import type { NextConfig } from "next";

/**
 * NEXT.JS 16 & NODE 24 CONFIGURATION — SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * Node.js: 24.x (LTS)
 * TS Engine: 6.0 Ready
 * i18n Strategy: App Router Middleware (Configuração removida para evitar erro de build)
 */


const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  cacheComponents: true,
  
  // Suporte nativo para telemetria no Node 24 (Otimizado para Sharp)
  serverExternalPackages: ["@microsoft/applicationinsights-web"], 

  experimental: {
    // Next 16: Otimização agressiva de pacotes de UI
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
      "date-fns"
    ],
    // React 19/20 Taint API: Segurança para dados sensíveis do backend
    taint: true, 
    // Habilita o novo motor de cache estável do Next 16
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },

  /* * NOTA: O bloco 'i18n' foi removido porque o App Router lida com isso 
   * via diretórios [lang] e Middleware. Mantê-lo aqui causaria erro de build.
   */

  images: {
    // AVIF priorizado (Padrão ouro em 2026)
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128],
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
    minimumCacheTTL: 3600, 
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  typescript: {
    // Rigor do TS 6.0: Impede deploys com bugs de tipagem
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json'
  },

  // Segurança e Performance
  poweredByHeader: false, 
  compress: true,        
  
  // Transpilação de lógica de negócio compartilhada
  transpilePackages: ['@santos/portfolio-logic'], 
};

export default nextConfig;
