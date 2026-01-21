/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Segurança: Impede que o Next.js exponha informações da tecnologia no header HTTP
  poweredByHeader: false,

  // Rigor Técnico: Garante que o deploy só ocorra se o código estiver perfeito
  typescript: {
    ignoreBuildErrors: false, 
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },

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

  // Recursos Avançados do Next.js 15
  experimental: {
    typedRoutes: true,
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion', 
      'clsx', 
      'tailwind-merge'
    ],
    serverSourceMaps: false,
  },

  // Cabeçalhos de Segurança e Gerenciamento de Assets (Pasta Public)
  async headers() {
    return [
      {
        // Regras Gerais de Segurança para todas as rotas
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com;",
              "style-src 'self' 'unsafe-inline';",
              // Note que adicionamos 'self' para permitir as imagens da sua própria pasta /public
              "img-src 'self' blob: data: https://github.com https://*.githubusercontent.com https://images.unsplash.com;",
              "font-src 'self' data:;",
              "connect-src 'self' https://api.github.com https://*.vercel-analytics.com;",
              "frame-ancestors 'none';",
            ].join(' '),
          },
        ],
      },
      {
        // Cache agressivo para Imagens, Ícones e OG Images (1 ano)
        source: '/(images|icons|og-image-).*\\.(png|ico|jpg|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Configuração específica para os Currículos (PDFs)
        // Isso garante que o navegador saiba que é um arquivo para visualização/download
        source: '/cv-sergio-santos-:lang(pt|en|es).pdf',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/pdf',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate', // Cache de 1 dia para PDFs (mais fácil de atualizar)
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
