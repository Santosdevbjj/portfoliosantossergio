 import "./src/env"; 
// import { env } from "./src/env";
import type { NextConfig } from "next";

/**
 * NEXT.JS 16.1.6 & NODE 24 CONFIGURATION — SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * ✔ TypeScript 6.0 Strict Ready
 * ✔ Turbopack (Rust Engine) Compatibility FIXED
 * ✔ FIXED: "Can not repeat path" by renaming and restructuring wildcards
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  poweredByHeader: false,
  compress: true,
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

  images: {
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
        // Alterado de :path* para :all* para evitar conflito com a palavra reservada 'path' no Turbopack
        source: '/:all*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      /**
       * SOLUÇÃO DEFINITIVA PARA O ERRO DE REPETIÇÃO:
       * Usamos prefixos fixos e capturamos o restante sem usar modificadores de repetição complexos.
       * O Next.js 16 trata :slug como o nome do arquivo.
       */
      {
        source: '/cv-sergio-santos-:slug.pdf',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/og-image-:slug.png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        // Para pastas, usamos :file* que é mais aceito pelo parser Rust
        source: '/images/:file*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/icons/:file*',
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
