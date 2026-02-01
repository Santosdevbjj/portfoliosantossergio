import type { NextConfig } from 'next';

/**
 * NEXT.JS CONFIGURATION — SÉRGIO SANTOS (REVISÃO CRÍTICA 2026.1)
 * Stack: Next.js 16.1.6 + Node 24.x + Turbopack + Vercel
 * Foco: Performance de Missão Crítica e Segurança Hardened
 */

const nextConfig: NextConfig = {
  /* -------------------------------------------------------------------------- */
  /* CORE SETTINGS                                                              */
  /* -------------------------------------------------------------------------- */
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Typed Routes nativo na raiz para TypeScript 6/7
  typedRoutes: true,

  typescript: {
    // Mantemos false para garantir a integridade dos dados antes do deploy
    ignoreBuildErrors: false,
    tsconfigPath: 'tsconfig.json',
  },

  /* -------------------------------------------------------------------------- */
  /* COMPILER & PERFORMANCE (Turbopack 2026)                                    */
  /* -------------------------------------------------------------------------- */
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },

  // Otimização para o motor nativo Turbopack
  turbo: {
    rules: {
      // Regras personalizadas para loaders de assets se necessário
    },
  },

  /* -------------------------------------------------------------------------- */
  /* IMAGES (Otimização para Provedores de Dados)                               */
  /* -------------------------------------------------------------------------- */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: true, // Necessário para alguns badges do GitHub
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'media.licdn.com' },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* EXPERIMENTAL FEATURES                                                      */
  /* -------------------------------------------------------------------------- */
  experimental: {
    // Previne carregamento de código desnecessário no bundle final
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'clsx',
      'tailwind-merge',
    ],
    // Garante que o Node 24 gerencie bem o middleware de proxy
    nodeJsMiddleware: true,
  },

  /* -------------------------------------------------------------------------- */
  /* SECURITY HEADERS (CSP Hardened v2)                                         */
  /* -------------------------------------------------------------------------- */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
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
              // Adicionada permissão para scripts de análise da Vercel
              "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://va.vercel-scripts.com;",
              "style-src 'self' 'unsafe-inline';",
              "font-src 'self' data: https:;",
              // Connect-src expandido para APIs de dados e WebSocket de desenvolvimento
              "connect-src 'self' https://api.github.com https://*.vercel-storage.com" + 
              (process.env.NODE_ENV === 'development' ? ' ws: wss:;' : ';'),
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
