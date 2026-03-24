import type { NextConfig } from "next";

/**
 * NEXT.JS 16.2.0 CONFIGURATION - SERGIO SANTOS PORTFOLIO (MARCH 2026)
 * -----------------------------------------------------------------------------
 * ✔ TS 6.0.2 Compliance
 * ✔ Turbopack Native Engine
 * ✔ Multilingual Asset Optimization (PDF/OG/Icons)
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  reactCompiler: true, 
  typedRoutes: true,
  
  // ESTABILIZADO NA 16.2: Substitui o antigo 'experimental.ppr'
  cacheComponents: true,

  // NOVO NA 16.2: Logs inteligentes e encaminhamento do Browser para o Terminal de IA
  logging: {
    fetches: { fullUrl: true },
  },

  experimental: {
    // Melhoria de scroll baseada no comportamento nativo do browser (React Fragment Refs)
    appNewScrollHandler: true,
    // Agrupa prefetch de segmentos em um único request (Otimização de Latência 2026)
    prefetchInlining: true,
    // Segurança: Impede que objetos sensíveis do server vazem para o client
    taint: true,
    
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
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    // 16.2 otimizou o escalonamento de imagens pequenas para ícones
    imageSizes: [16, 32, 48, 64, 96, 128],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    minimumCacheTTL: 14400, // 4 horas de cache persistente
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.medium.com' }
    ],
  },

  // CONFIGURAÇÃO TURBOPACK NATIVA (Sincronizada com o tsconfig.json)
  turbopack: {
    resolveAlias: {
      // Resolve conflitos do PDF.js/Canvas no ambiente Rust do Turbopack
      'canvas': './src/lib/empty.ts',
    },
    // Filtra warnings ruidosos de bibliotecas antigas (Novo na 16.2)
    ignoreIssue: [
      { path: '**/node_modules/react-pdf/**', title: 'Module not found' }
    ]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ],
      },
      // ESTRUTURA MULTILINGUE: CVs (pt-BR, en-US, es-ES, es-AR, es-MX)
      {
        source: '/pdf/cv-sergio-santos-:lang(pt-BR|en-US|es-ES|es-AR|es-MX).pdf',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Content-Type', value: 'application/pdf' },
          { key: 'Content-Disposition', value: 'inline' }
        ],
      },
      // ESTRUTURA MULTILINGUE: OG Images (Redes Sociais)
      {
        source: '/og/og-image-:lang(pt-BR|en-US|es-ES|es-AR|es-MX).png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ],
      },
      // CACHE PARA ATIVOS DE ARTIGOS E ÍCONES (Imutáveis por 1 ano)
      {
        source: '/(artigos|icons|images)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ],
      }
    ];
  },
};

export default nextConfig;
