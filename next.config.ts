import type { NextConfig } from "next";

/**
 * NEXT.JS 16 CONFIGURATION - SERGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * ✔ React Compiler: Estável na raiz (Next.js 16)
 * ✔ OG Images: Rotas de cache corrigidas para suportar :slug dinâmico
 * ✔ Octokit & Turbopack: Compatibilidade via serverExternalPackages
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  reactCompiler: true, 
  typedRoutes: true, 

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
      "date-fns"
    ],
    taint: true, 
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },

  // Mantendo a compatibilidade do Octokit, Sharp (essencial para OG Images) 
  // e Application Insights.
  serverExternalPackages: [
    "octokit", 
    "@octokit/core", 
    "sharp", 
    "gray-matter",
    "@microsoft/applicationinsights-web"
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
      // RESTAURAÇÃO: Rotas explícitas para garantir que o cache de OG Images e PDF funcione com :slug
      {
        source: '/cv-sergio-santos-:slug.pdf',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/og-image-:slug.png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/icons/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      }
    ];
  },
};

export default nextConfig;
