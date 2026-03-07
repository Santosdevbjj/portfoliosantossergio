import type { NextConfig } from "next";

/**
 * NEXT.JS 16 CONFIGURATION - SERGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * ✔ React Compiler: Estável no nível raiz (Next.js 16 + React 19)
 * ✔ Turbopack: Compatibilidade garantida via serverExternalPackages
 * ✔ TypeScript 6.0: Suporte a typedRoutes
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // CORREÇÃO: No Next.js 16, o compilador é estável e fica na raiz
  reactCompiler: true, 
  
  // Gera links tipados para o roteamento do Next.js
  typedRoutes: true, 

  experimental: {
    // Otimiza o tempo de build/runtime para bibliotecas comuns
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
      "date-fns"
    ],
    
    // Proteção contra vazamento de dados do servidor (Data Tainting)
    taint: true, 
    
    // Controle fino de cache de navegação do cliente
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },

  // ESSENCIAL PARA OCTOKIT + TURBOPACK
  // Evita que o Turbopack tente empacotar módulos nativos de Node.js
  // que o Octokit e o Sharp utilizam internamente.
  serverExternalPackages: [
    "octokit", 
    "@octokit/core", 
    "sharp",
    "gray-matter"
  ],

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128],
    minimumCacheTTL: 3600,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.medium.com' }
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }
        ],
      },
      {
        source: '/(cv-sergio-santos|og-image|images|icons)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      }
    ];
  },
};

export default nextConfig;
