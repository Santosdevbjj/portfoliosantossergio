import type { NextConfig } from "next";

/**
 * NEXT.JS 16 CONFIGURATION - SERGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * ✔ React Compiler: Estável (Next.js 16)
 * ✔ PDF Support: Otimizado para visualização e download via public/pdf/
 * ✔ OG Images: Cache imutável para as versões multilingue em public/og/
 * ✔ Performance: Node 24 + Turbopack compatibilidade
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  reactCompiler: true, 
  typedRoutes: true, 

  experimental: {
    // Adicionado react-pdf para garantir compatibilidade com Server Components no Next 16
    serverComponentsExternalPackages: [
      "octokit", 
      "@octokit/core", 
      "sharp", 
      "gray-matter",
      "@microsoft/applicationinsights-web",
      "react-pdf" 
    ],
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
      "date-fns"
    ],
    taint: true, 
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128],
    minimumCacheTTL: 3600,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.medium.com' }
    ],
  },

  // Configuração de Webpack para suporte nativo a arquivos PDF se importados via TS
  webpack: (config) => {
    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/pdf/[name][ext]',
      },
    });
    return config;
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }
        ],
      },
      // CORREÇÃO: Cache imutável para os currículos na pasta /pdf/
      {
        source: '/pdf/cv-sergio-santos-:lang.pdf',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Content-Type', value: 'application/pdf' },
          { key: 'Content-Disposition', value: 'inline' } // Permite abrir no navegador em vez de forçar download
        ],
      },
      // CORREÇÃO: Cache imutável para as OG Images na pasta /og/
      {
        source: '/og/og-image-:lang.png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/icons/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      }
    ];
  },
};

export default nextConfig;
