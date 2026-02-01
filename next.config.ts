import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Configurações padrão do Next.js 16 */
  reactStrictMode: true,

  // No Next.js 16, o Turbo é configurado fora do 'experimental' 
  // ou habilitado via CLI. Para regras de loader (como SVG):
  turbo: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  experimental: {
    // Removido o 'turbo' daqui de dentro
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
    ],
  },

  // Configuração de imagens deve estar aqui também para o build local
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.medium.com' }
    ]
  }
};

export default nextConfig;
