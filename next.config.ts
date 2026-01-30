import type { NextConfig } from 'next';

/**
 * NEXT.JS CONFIGURATION
 * Target: Next.js 16.1.5 + Node 24.x + Vercel + App Router (src/)
 * Status: Production-safe / Termux-safe / CSP-hardened
 */

const nextConfig: NextConfig = {
  /* -------------------------------------------------------------------------- */
  /* CORE                                                                       */
  /* -------------------------------------------------------------------------- */
  reactStrictMode: true,
  poweredByHeader: false,

  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: 'tsconfig.json',
  },

  /* -------------------------------------------------------------------------- */
  /* COMPILER                                                                   */
  /* -------------------------------------------------------------------------- */
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },

  /* -------------------------------------------------------------------------- */
  /* IMAGES                                                                     */
  /* -------------------------------------------------------------------------- */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 86400,

    // Segurança: evita uso do servidor como proxy de imagens gigantes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/u/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        pathname: '/dms/image/**',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* EXPERIMENTAL (Next.js 16 COMPATÍVEL)                                       */
  /* -------------------------------------------------------------------------- */
  experimental: {
    // typedRoutes ainda é experimental no 16.x
    typedRoutes: true,

    // Evita engine Rust que quebra no Termux
    typedEnv: false,

    // Tree-shaking agressivo e seguro
    optimizePackageImports: [
      'lucide-react',
      'motion',
      'clsx',
      'tailwind-merge',
      'next-themes',
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* SECURITY HEADERS                                                           */
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
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "img-src 'self' data: https: blob:;",
              "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://va.vercel-scripts.com;",
              "style-src 'self' 'unsafe-inline';",
              "font-src 'self' data: https:;",
              `connect-src 'self' https: ${
                process.env.NODE_ENV === 'development' ? 'ws: wss:' : ''
              };`,
              "frame-ancestors 'none';",
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
