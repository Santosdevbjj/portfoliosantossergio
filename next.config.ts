// import "./src/env"; 
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  reactCompiler: true,
  typedRoutes: true, 

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
      
       turbo: 
       rules: {'*.css': ['postcss-loader'],
      },
    
                               
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
    // Removido o sandbox restritivo para testar se a imagem/layout volta a aparecer
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.medium.com' }
    ],
  },

  // Removido o async redirects() daqui. 
  // MOTIVO: Deixe o middleware.ts gerenciar o redirecionamento de /[lang] 
  // para evitar loops infinitos entre as regras do servidor e do cliente.

  async headers() {
    return [
      {
        // Voltando para o padrão que a Vercel reconhece melhor em produção
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/cv-sergio-santos-:slug.pdf',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/og-image-:slug.png',
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

  // Garante que pacotes problemáticos não sejam processados pelo Turbopack indevidamente
  serverExternalPackages: ["@microsoft/applicationinsights-web"],
};

export default nextConfig;
