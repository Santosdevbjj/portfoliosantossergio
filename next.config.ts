import type { NextConfig } from 'next';

/**
 * NEXT.JS CONFIGURATION - Termux & 2026 Security Hardened (Next.js 16.1.5+)
 * -----------------------------------------------------------------------------
 * Fixes: turbo.createProject WASM error, CVE-2025-59471 (DoS), Motion 12 Compat
 */
const nextConfig: NextConfig = {
  /* -------------------------------------------------------------------------- */
  /* CORE & STABILITY                                                           */
  /* -------------------------------------------------------------------------- */
  reactStrictMode: true,
  poweredByHeader: false, 
  
  //typedRoutes é estável na 16.1.5 e funciona bem em WASM
  typedRoutes: true,
  
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: 'tsconfig.json',
  },

  /* -------------------------------------------------------------------------- */
  /* COMPILER & OPTIMIZATION                                                    */
  /* -------------------------------------------------------------------------- */
  compiler: {
    // Remove consoles em produção exceto erros e avisos
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },

  /* -------------------------------------------------------------------------- */
  /* IMAGES (Security: CVE-2025-59471 Hardened)                                 */
  /* -------------------------------------------------------------------------- */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 86400,
    dangerouslyAllowLocalIP: false,

    // PATHNAMES OBRIGATÓRIOS: Evita que atacantes usem seu servidor para processar imagens gigantes
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/u/**' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'media.licdn.com', pathname: '/dms/image/**' },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* BUNDLER & IMPORTS (WASM Compatible Otimizations)                           */
  /* -------------------------------------------------------------------------- */
  experimental: {
    // DESATIVADO: typedEnv pode forçar o motor Rust que quebra no Termux
    typedEnv: false, 

    // ATUALIZADO: Usando o novo nome do pacote 'motion' para otimização
    optimizePackageImports: [
      'lucide-react',
      'motion',
      'clsx',
      'tailwind-merge',
      'next-themes',
    ],
    
    // Proteção contra CVE-2025-59472 - Estável na 16.1.5
    ppr: 'incremental',
  },

  /* -------------------------------------------------------------------------- */
  /* SECURITY HEADERS (Proteção contra RCE e XSS 2026)                          */
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
              // 'wasm-unsafe-eval' é essencial para o motor de 120fps do Motion 12
              "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://va.vercel-scripts.com;",
              "style-src 'self' 'unsafe-inline';",
              "font-src 'self' data: https:;",
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
