/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Segurança: Impede que o Next.js exponha informações da tecnologia no header HTTP
  poweredByHeader: false,

  // Rigor Técnico: Garante que o deploy só ocorra se o código estiver perfeito
  // Nota: O ESLint agora é gerenciado via CLI (eslint.config.mjs), 
  // por isso removemos a chave 'eslint' daqui para conformidade com a v16.
  typescript: {
    ignoreBuildErrors: false, 
  },

  // Estabilização: typedRoutes agora é padrão e melhora o DX com TS
  typedRoutes: true,

  // Otimizações do Compilador (SWC)
  compiler: {
    // Remove console.log em produção para maior performance e privacidade
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  images: {
    // Formatos de próxima geração (AVIF é superior ao WebP em compressão)
    formats: ['image/avif', 'image/webp'],
    
    // Configuração robusta para assets externos (GitHub e Unsplash)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
        pathname: '/**',
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
    ],
    deviceSizes: [450, 640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 3600,
  },

  // Recursos de Performance 2026
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion', 
      'clsx', 
      'tailwind-merge'
    ],
    // Node 24 lida melhor com source maps internamente
    serverSourceMaps: false,
  },

  // Cabeçalhos de Segurança e Gerenciamento de Assets
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
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://vercel.live;",
              "style-src 'self' 'unsafe-inline';",
              "img-src 'self' blob: data: https://github.com https://*.githubusercontent.com https://images.unsplash.com https://vercel.com;",
              "font-src 'self' data:;",
              "connect-src 'self' https://api.github.com https://*.vercel-analytics.com https://*.vitals.vercel-insights.com;",
              "frame-ancestors 'none';",
            ].join(' '),
          },
        ],
      },
      {
        // Cache agressivo para imagens e assets estáticos
        source: '/:path*((?!(?:api|_next)).*\\.(?:png|ico|jpg|webp|avif|svg))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Ajuste no source do PDF
        source: '/:file(cv-sergio-santos-.*\\.pdf)',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/pdf',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
