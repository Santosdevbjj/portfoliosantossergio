/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Segurança: Impede a exposição da tecnologia no header HTTP
  poweredByHeader: false,

  // Rigor Técnico: Garante que o deploy pare se houver erros de tipo
  typescript: {
    ignoreBuildErrors: false, 
  },

  // Next.js 16: typedRoutes melhora a segurança de navegação com TS
  typedRoutes: true,

  // Otimizações do Compilador (SWC)
  compiler: {
    // Limpeza de logs em produção para performance e privacidade
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  images: {
    // AVIF é prioridade em 2026 para melhores notas de LCP (Web Vitals)
    formats: ['image/avif', 'image/webp'],
    
    // Remote Patterns para ativos externos
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

  // Recursos de Performance e Modernização Node 24
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion', 
      'clsx', 
      'tailwind-merge'
    ],
    serverSourceMaps: false,
  },

  // Cabeçalhos de Segurança e Gestão de Cache
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
              // Adicionado suporte para Web Vitals e Insights da Vercel
              "connect-src 'self' https://api.github.com https://*.vercel-analytics.com https://*.vitals.vercel-insights.com;",
              "frame-ancestors 'none';",
            ].join(' '),
          },
        ],
      },
      {
        // Regex aprimorada para cache imutável de assets (Otimização de Performance)
        source: '/:path*((?!(?:api|_next)).*\\.(?:png|ico|jpg|webp|avif|svg))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Tratamento específico para o currículo em PDF
        source: '/:file(cv-sergio-santos-.*\\.pdf)',
        headers: [
          { key: 'Content-Type', value: 'application/pdf' },
          { key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
