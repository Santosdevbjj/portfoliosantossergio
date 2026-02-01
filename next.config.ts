import type { NextConfig } from 'next';

/**
 * NEXT.JS CONFIGURATION — SÉRGIO SANTOS (VERSÃO ESTÁVEL 2026)
 * Ajustada para compatibilidade WASM (Termux) e Vercel
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Typed Routes nativo
  typedRoutes: true,

  typescript: {
    ignoreBuildErrors: false,
  },

  compiler: {
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
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'clsx',
      'tailwind-merge',
    ],
    // Removido nodeJsMiddleware (não suportado em WASM)
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
              "img-src 'self' data: https: blob:;",
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
