import type { NextConfig } from "next";

/**
 * NEXT.JS 16 & NODE 24 CONFIGURATION — SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * Node.js: 24.x (LTS)
 * TS Engine: 6.0 Ready
 * Deployment Target: Edge/Node Runtime
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Suporte nativo para telemetria no Node 24
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
    // React 19/20 Taint API: Impede que objetos de banco de dados vazem para o cliente
    taint: true, 
    // Habilita o novo motor de cache estável do Next 16
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },

  // Configuração de i18n para suporte nativo aos seus 5 idiomas
  i18n: {
    locales: ['pt-BR', 'en-US', 'es-ES', 'es-AR', 'es-MX'],
    defaultLocale: 'pt-BR',
    localeDetection: true,
  },

  images: {
    // AVIF priorizado para Node 24 (Sharp 0.35+)
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
    minimumCacheTTL: 3600, // Aumentado para 1h para melhor LCP em 2026
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  typescript: {
    // TS 6.0 strict compliance
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json'
  },

  // Segurança de Headers (Padrão Séc. XXI)
  poweredByHeader: false, 
  compress: true,        
  
  // Garante que o Turbopack entenda seus decorators se usar algum em Data Science
  transpilePackages: ['@santos/portfolio-logic'], 
};

export default nextConfig;
