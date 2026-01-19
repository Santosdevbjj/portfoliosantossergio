/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Segurança: Impede que o Next.js exponha informações do servidor no header
  poweredByHeader: false,

  // Build e Integridade técnica
  typescript: {
    // Em 2026, manter o build estrito evita regressões em produção
    ignoreBuildErrors: false, 
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Otimizações de Compilação de Próxima Geração
  compiler: {
    // Remove console.log em produção, mantendo apenas erros críticos
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  images: {
    // Configuração robusta para imagens externas (GitHub e Unsplash)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
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
    // Prioriza formatos modernos (AVIF é 30% menor que WebP)
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [450, 640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60,
  },

  // Recursos do Next.js 15
  experimental: {
    typedRoutes: true,
    // Reduz drasticamente o tamanho do bundle ao importar ícones de forma inteligente
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // Melhora a performance de Server Components
    serverSourceMaps: false,
  },

  // Segurança de Headers (Hardened Configuration)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Permite frames apenas do próprio domínio
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https://api.github.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
