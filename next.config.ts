import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* -------------------------------------------------------------------------- */
  /* CORE & STABILITY (Hardened for Next.js 16)                                 */
  /* -------------------------------------------------------------------------- */
  reactStrictMode: true,
  poweredByHeader: false,
  
  // No Next.js 16, estas flags saíram de 'experimental' para o topo
  typedRoutes: true,
  
  typescript: {
    // Garantia de integridade para o Especialista em Sistemas
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
  /* IMAGES (Optimized for High Latency Regions like gru1)                      */
  /* -------------------------------------------------------------------------- */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [450, 640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 86400,
    dangerouslyAllowLocalIP: false,

    remotePatterns: [
      { protocol: 'https', hostname: '*.githubusercontent.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* EXPERIMENTAL (Controlled Features)                                         */
  /* -------------------------------------------------------------------------- */
  experimental: {
    // Mantendo apenas o que ainda é experimental ou requer controle fino
    typedEnv: true,

    optimizePackageImports: [
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'framer-motion',
      'next-themes',
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* SECURITY HEADERS (Padrão Enterprise 2026)                                  */
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
              "img-src 'self' data: https:;",
              "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval';",
              "style-src 'self' 'unsafe-inline';",
              "font-src 'self' data: https:;",
              // Suporte ao protocolo MCP e WebSockets em desenvolvimento
              `connect-src 'self' https: ${process.env.NODE_ENV === 'development' ? 'ws: wss:' : ''};`,
              "frame-ancestors 'none';",
              "upgrade-insecure-requests;",
            ].join(' '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
