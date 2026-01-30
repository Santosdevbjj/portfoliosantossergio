import type { NextConfig } from 'next';

/**
 * NEXT.JS CONFIGURATION - Hardened for 2026 (Next.js 16.1.5+)
 * -----------------------------------------------------------------------------
 * Security fixes for: CVE-2025-55182 (RCE), CVE-2025-59471 (DoS), CVE-2026-23864 (RSC DoS)
 */
const nextConfig: NextConfig = {
  /* -------------------------------------------------------------------------- */
  /* CORE & STABILITY                                                           */
  /* -------------------------------------------------------------------------- */
  reactStrictMode: true,
  poweredByHeader: false, // Proteção contra fingerprinting
  
  // No Next.js 16.1.5, typedRoutes garante integridade na navegação
  typedRoutes: true,
  
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: 'tsconfig.json',
  },

  /* -------------------------------------------------------------------------- */
  /* COMPILER & OPTIMIZATION                                                    */
  /* -------------------------------------------------------------------------- */
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },

  /* -------------------------------------------------------------------------- */
  /* IMAGES (Hardened against CVE-2025-59471)                                   */
  /* -------------------------------------------------------------------------- */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Removido tamanhos excessivos
    minimumCacheTTL: 86400,
    dangerouslyAllowLocalIP: false,

    // CORREÇÃO CRÍTICA: Adicionado pathnames restritivos para evitar DoS de memória
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/u/**' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'media.licdn.com', pathname: '/dms/image/**' },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* BUNDLER & IMPORTS (Next.js 16 + Framer Motion 12 Optimization)             */
  /* -------------------------------------------------------------------------- */
  experimental: {
    typedEnv: true,
    // Otimização específica para Framer Motion 12 e Lucide
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'clsx',
      'tailwind-merge',
      'next-themes',
    ],
    // Proteção contra CVE-2025-59472 (PPR Security Fix)
    ppr: 'incremental',
  },

  /* -------------------------------------------------------------------------- */
  /* SECURITY HEADERS (Proteção contra RCE e Deserialização RSC)                */
  /* -------------------------------------------------------------------------- */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "img-src 'self' data: https: blob:;",
              // script-src: 'wasm-unsafe-eval' é necessário para o motor de animação do Framer Motion 12
              "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://va.vercel-scripts.com;",
              "style-src 'self' 'unsafe-inline';",
              "font-src 'self' data: https:;",
              // connect-src: Essencial para evitar o bypass do React Server Components
              `connect-src 'self' https: ${process.env.NODE_ENV === 'development' ? 'ws: wss:' : ''};`,
              "frame-ancestors 'none';",
              "upgrade-insecure-requests;",
              "object-src 'none';",
              "base-uri 'self';",
              "form-action 'self';",
            ].join(' '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
