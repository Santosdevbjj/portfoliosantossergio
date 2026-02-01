import type { NextConfig } from 'next';

/**
 * NEXT.JS CONFIGURATION — SÉRGIO SANTOS (BASELINE 2026)
 * Otimizado para Tailwind v4 Oxide, Turbopack e Segurança P3.
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Typed Routes para garantir que links internos nunca quebrem
  typedRoutes: true,

  typescript: {
    // Mantemos como false para garantir qualidade total no build da Vercel
    ignoreBuildErrors: false,
  },

  compiler: {
    // Limpeza de logs em produção, preservando erros críticos
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'media.licdn.com' },
    ],
  },

  experimental: {
    // Crucial para a performance da Lucide-React 0.563.0 e Framer Motion
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'clsx',
      'tailwind-merge',
    ],
    // Habilita o suporte nativo para o motor Oxide do Tailwind v4
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              // Atualizado para permitir imagens dos hosts do remotePatterns
              "img-src 'self' data: https://avatars.githubusercontent.com https://images.unsplash.com https://media.licdn.com blob:;",
              "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://va.vercel-scripts.com;",
              "style-src 'self' 'unsafe-inline';",
              "font-src 'self' data: https:;",
              "connect-src 'self' https://api.github.com https://*.vercel-storage.com" + 
              (process.env.NODE_ENV === 'development' ? ' ws: wss:;' : ';'),
            ].join(' '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
