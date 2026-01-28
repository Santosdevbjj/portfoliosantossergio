import type { NextConfig } from 'next';

/**
 * NEXT.JS CONFIGURATION - Enterprise Grade (Next.js 16.x)
 * -----------------------------------------------------------------------------
 * Hardened for Security (CVE-2025-66478) and High Performance.
 */
const nextConfig: NextConfig = {
  /* -------------------------------------------------------------------------- */
  /* CORE & STABILITY                                                           */
  /* -------------------------------------------------------------------------- */
  reactStrictMode: true,
  poweredByHeader: false, // Segurança: Não revela o uso de Next.js
  
  // No Next.js 16, typedRoutes é estável e essencial para evitar 404
  typedRoutes: true,
  
  typescript: {
    // Rigor técnico: Impedir builds com erro de tipo
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
  /* IMAGES (Region Optimized)                                                  */
  /* -------------------------------------------------------------------------- */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [450, 640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 86400,
    
    // Bloqueia tentativas de SSR de imagens de IPs locais maliciosos
    dangerouslyAllowLocalIP: false,

    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'media.licdn.com' }, // Adicionado para fotos do LinkedIn
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* BUNDLER & IMPORTS (Next.js 16 Optimization)                                */
  /* -------------------------------------------------------------------------- */
  experimental: {
    // typedEnv garante que o processo falhe se faltarem variáveis de ambiente
    typedEnv: true,
    
    // Reduz drasticamente o tempo de build no Next.js 16
    optimizePackageImports: [
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'framer-motion',
      'next-themes',
      'date-fns',
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* SECURITY HEADERS (Padrão 2026 - Proteção contra RCE e DoS)                 */
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
              "img-src 'self' data: https: blob:;", // Adicionado blob: para compatibilidade
              // Segurança contra RSC RCE: script-src mais restrito
              "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://va.vercel-scripts.com;",
              "style-src 'self' 'unsafe-inline';",
              "font-src 'self' data: https:;",
              // Restringe conexões apenas ao domínio e Vercel Analytics
              `connect-src 'self' https: ${process.env.NODE_ENV === 'development' ? 'ws: wss:' : ''};`,
              "frame-ancestors 'none';",
              "upgrade-insecure-requests;",
              "object-src 'none';", // Bloqueia plugins legados (Flash, etc)
              "base-uri 'self';",
              "form-action 'self';", // Impede que formulários enviem dados para sites externos
            ].join(' '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
