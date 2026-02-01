import type { NextConfig } from "next";

/**
 * NEXT.JS 16 CONFIGURATION — SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * Revisão: Padronização de formatos de imagem para evitar erros de compilação.
 * Revisão: Otimização de pacotes para performance máxima no Turbopack.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Otimização de pacotes para carregamento rápido (Crucial para mobile)
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
    ],
  },

  images: {
    /**
     * Removido 'image/avif' para manter sincronia com vercel.ts e evitar
     * conflito de tipos que travou o build anterior.
     */
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.medium.com',
      }
    ],
  },

  // Garante que o build ignore erros de linting para focar apenas em erros reais de código
  typescript: {
    ignoreBuildErrors: false, 
  },
};

export default nextConfig;
