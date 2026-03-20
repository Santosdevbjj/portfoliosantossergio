import type { NextConfig } from "next";

/**
 * NEXT.JS 16.2 CONFIGURATION - SERGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * ✔ AI Ready: AGENTS.md + Browser Log Forwarding
 * ✔ PPR: Estabilizado como cacheComponents
 * ✔ Turbopack: Configuração de nível superior (Out of Experimental)
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  reactCompiler: true, 
  typedRoutes: true,
  
  // NOVA REGRA 16.2: PPR agora é ativado aqui
  cacheComponents: true,

  // NOVA REGRA 16.2: Encaminha erros do navegador para o seu terminal de IA
  logging: {
    fetches: { fullUrl: true },
    browserToTerminal: true, 
  },

  experimental: {
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
    prefetchInlining: true,
    // Melhoria de scroll baseada no comportamento nativo do browser (16.2)
    appNewScrollHandler: true,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    // 16.2 removeu o valor 16 do padrão, mantendo compatibilidade aqui
    imageSizes: [16, 32, 48, 64, 96, 128],
    minimumCacheTTL: 14400, // Aumentado para 4h conforme padrão da v16
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.medium.com' }
    ],
  },

  // Turbopack agora no nível superior
  turbopack: {
    resolveAlias: {
      // Garante que o PDF.js funcione corretamente no Turbopack
      'canvas': './empty.ts',
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
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }
        ],
      },
      // Suporte Multilingue para CVs (pt-BR, en-US, es-ES, es-AR, es-MX)
      {
        source: '/pdf/cv-sergio-santos-:lang(pt-BR|en-US|es-ES|es-AR|es-MX).pdf',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Content-Type', value: 'application/pdf' },
          { key: 'Content-Disposition', value: 'inline' }
        ],
      },
      // Suporte Multilingue para OG Images
      {
        source: '/og/og-image-:lang(pt-BR|en-US|es-ES|es-AR|es-MX).png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(images|icons)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      }
    ];
  },
};

export default nextConfig;
