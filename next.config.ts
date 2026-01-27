/** @type {import('next').NextConfig} */
const nextConfig = {
  /* -------------------------------------------------------------------------- */
  /* CORE & STABILITY                                                           */
  /* -------------------------------------------------------------------------- */
  reactStrictMode: true,
  poweredByHeader: false,

  typescript: {
    // Garantia de integridade para o Especialista em Sistemas
    ignoreBuildErrors: false,
    // Caminho explícito conforme novas docs de jan/2026
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
  /* IMAGES (Hardened & Optimized)                                              */
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
  /* EXPERIMENTAL (Next.js 16 Features)                                         */
  /* -------------------------------------------------------------------------- */
  experimental: {
    // Ativa tipagem estática para rotas (Link href)
    typedRoutes: true,
    
    // NOVIDADE JAN/2026: IntelliSense para variáveis de ambiente
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
  /* SECURITY HEADERS (Padrão 2026)                                             */
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
              // Adicionado suporte a frames/scripts de fontes confiáveis se necessário
              "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval';",
              "style-src 'self' 'unsafe-inline';",
              "font-src 'self' data: https:;",
              // 'connect-src' atualizado para suportar o protocolo MCP em dev
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
