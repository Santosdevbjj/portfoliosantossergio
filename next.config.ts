import type { NextConfig } from "next";

/**
 * NEXT.JS 16 & NODE 24 CONFIGURATION — SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * Estabilidade: Node 24.x (LTS Ready)
 * Compilador: Turbopack + TS 6.0 Go-Engine Compatibility
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Habilita o suporte a CSS moderno e otimizações de runtime do Node 24
  serverExternalPackages: ["@microsoft/applicationinsights-web"], 

  experimental: {
    // Essencial para o Next 16: Reduz o bundle enviando apenas o que é usado
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
      "date-fns" // Adicionado para performance em i18n
    ],
    // Ativa o suporte para as novas APIs de Data Fetching do React 19/Next 16
    taint: true, 
  },

  images: {
    /**
     * Reativando AVIF: No Node 24 + Next 16, o suporte ao processamento de 
     * imagens via motor nativo (Sharp) está muito mais estável.
     * O WebP é ótimo, mas AVIF reduz mais 20% do peso para mobile.
     */
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // Mais específico que **
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

  /**
   * TS 6.0 Rigor: 
   * Não ignore erros de build. Com 'isolatedDeclarations' no seu tsconfig,
   * o Next 16 agora consegue compilar tipos muito mais rápido se eles estiverem corretos.
   */
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    // Previne que avisos simples travem o deploy na Vercel (opcional)
    ignoreDuringBuilds: false, 
  },

  // Otimização de saída para sistemas de missão crítica
  poweredByHeader: false, // Segurança: Não expõe que o site usa Next.js
  compress: true,        // Garante compressão Gzip/Brotli via Node 24
};

export default nextConfig;
