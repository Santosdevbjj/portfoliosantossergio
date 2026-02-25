import type { NextConfig } from "next";

/**
 * NEXT.JS 16 & NODE 24 CONFIGURATION — SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * ✔ TypeScript 6.0 Strict Ready
 * ✔ Turbopack Optimized
 * ✔ Security & i18n Path Consistency
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Configurações de Compilação e Otimização de Pacotes
  experimental: {
    // Next 16: Otimização agressiva para bibliotecas de UI e Icons
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
      "date-fns"
    ],
    // React 19/20 Taint API: Proteção contra vazamento de objetos do servidor para o cliente
    taint: true, 
    // Gestão estável de cache para rotas dinâmicas [lang]
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },

  // Configuração de Imagens (TypeScript 6.0 Safe via 'as const')
  images: {
    formats: ['image/avif', 'image/webp'] as const,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128],
    minimumCacheTTL: 3600,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.medium.com' }
    ],
  },

  // Redirecionamentos para evitar Erros 404 (Sincronizado com seus Assets)
  async redirects() {
    return [
      {
        // Garante que a raiz aponte para o locale completo usado no seu sistema
        source: '/',
        destination: '/pt-BR',
        permanent: true,
      },
    ];
  },

  // Cabeçalhos de Cache e Segurança para PDFs e Assets
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Cache agressivo para currículos e imagens da pasta public
        source: '/(cv-|og-image-|images|icons).*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // Configurações de Infraestrutura
  serverExternalPackages: ["@microsoft/applicationinsights-web"],
  // Transpilação caso existam pacotes locais ou bibliotecas ESM puras
  transpilePackages: ['lucide-react'],
};

export default nextConfig;
