import type { NextConfig } from "next";

/**
 * NEXT.JS 16.1.6 & NODE 24 CONFIGURATION — SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * ✔ TypeScript 6.0 Strict Ready
 * ✔ Turbopack (Rust Engine) Optimized
 * ✔ FIXED: Removed all RegEx capturing groups to satisfy Turbopack strictness
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

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

  images: {
    // TS 6.0 exige 'as const' para tuplas de formatos
    formats: ['image/avif', 'image/webp'] as const,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128],
    minimumCacheTTL: 3600,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.medium.com' }
    ],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/pt-BR',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        // Cabeçalhos de segurança globais
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      /**
       * SOLUÇÃO DEFINITIVA:
       * Substituímos o Regex complexo por padrões de caminho simples (:path*).
       * Isso mapeia perfeitamente seus arquivos na pasta /public sem violar as regras do Turbopack.
       */
      {
        source: '/cv-sergio-santos-:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/og-image-:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/icons/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/sitemap.xml',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' }],
      }
    ];
  },

  serverExternalPackages: ["@microsoft/applicationinsights-web"],
  transpilePackages: ['lucide-react'],
};

export default nextConfig;
