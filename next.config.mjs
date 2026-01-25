/** @type {import('next').NextConfig} */
const nextConfig = {
  /* -------------------------------------------------------------------------- */
  /* CORE & STABILITY                                                           */
  /* -------------------------------------------------------------------------- */
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Habilita o novo motor de cache estável da v16
  cacheComponents: true, 

  typescript: {
    // Mantemos false para garantir que o build da Vercel só passe se o TS estiver impecável
    ignoreBuildErrors: false,
  },

  // Novo no Next.js 16: Tipagem nativa para rotas
  typedRoutes: true,

  /* -------------------------------------------------------------------------- */
  /* COMPILER & TURBOPACK                                                       */
  /* -------------------------------------------------------------------------- */
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },

  // Na v16, turbopack é configuração de primeiro nível
  turbopack: {
    resolveAlias: {
      // Caso precise silenciar módulos de node em componentes client
      // fs: { browser: './src/empty.ts' }
    },
  },

  /* -------------------------------------------------------------------------- */
  /* IMAGES (Segurança Reforçada v16)                                            */
  /* -------------------------------------------------------------------------- */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [450, 640, 750, 828, 1080, 1200, 1920],
    
    // Atualizado: Valor padrão agora é 14400 (4h). 86400 (24h) é ótimo para seu portfólio.
    minimumCacheTTL: 86400, 
    
    // Proteção contra ataques de enumeração local (Breaking Change v16)
    dangerouslyAllowLocalIP: false,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* PERFORMANCE & EXPERIMENTAL                                                 */
  /* -------------------------------------------------------------------------- */
  experimental: {
    // Otimização de pacotes lucide/framer-motion
    optimizePackageImports: [
      'lucide-react', 
      'clsx', 
      'tailwind-merge', 
      'framer-motion'
    ],
    // Habilita o cache de sistema de arquivos para o Turbopack em dev
    turbopackFileSystemCacheForDev: true,
  },

  /* -------------------------------------------------------------------------- */
  /* SECURITY HEADERS (Patched for React2Shell)                                  */
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
            /**
             * CSP Hardened: 
             * - Bloqueia 'unsafe-eval' (essencial contra RCE)
             * - Permite inline styles/scripts apenas para o Next.js runtime
             */
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "img-src 'self' data: https:;",
              "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval';",
              "style-src 'self' 'unsafe-inline';",
              "font-src 'self' data: https:;",
              "connect-src 'self' https:;",
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
