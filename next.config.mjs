// @ts-check
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Suporte a MDX e TypeScript
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // 2. Estabilização Next.js 16.2 (Antigo PPR)
  cacheComponents: true,

  // 3. AI-Assisted Development (Encaminha logs do browser para o terminal)
  logging: {
    fetches: { fullUrl: true },
    browserToTerminal: true, 
  },

  // 4. Configuração do Turbopack (Nativo no 16.2)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // 5. Otimização de Imagens (Suporte para Fotos, Troféus DIO e GitHub)
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { 
        protocol: 'https', 
        hostname: 'raw.githubusercontent.com', 
        pathname: '/Santosdevbjj/**' 
      },
      { 
        protocol: 'https', 
        hostname: 'avatars.githubusercontent.com', 
        pathname: '/**' 
      },
      { 
        protocol: 'https', 
        hostname: '**.githubusercontent.com' 
      },
    ],
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 3600, // Cache de 1 hora para imagens remotas
  },

  // 6. Isolamento de pacotes (Node 24 / React 19 / PDF Support)
  serverExternalPackages: ['pdfjs-dist', 'canvas', 'sharp', 'react-pdf'],

  // 7. Configurações Experimentais Refinadas
  experimental: {
    mdxRs: true,
    taint: true,
    appNewScrollHandler: true, // Novo sistema de foco/scroll da 16.2
  },

  // 8. Segurança e Cache de Assets (PDFs e OG Images Multilíngues)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      // Cache Imutável para os 5 currículos (PT, EN, ES-ES, ES-AR, ES-MX)
      {
        source: '/pdf/cv-sergio-santos-:lang(pt-BR|en-US|es-ES|es-AR|es-MX).pdf',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Content-Type', value: 'application/pdf' },
          { key: 'Content-Disposition', value: 'inline' }
        ],
      },
      // Cache Imutável para OG Images Multilíngues
      {
        source: '/og/og-image-:lang(pt-BR|en-US|es-ES|es-AR|es-MX).png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // Otimização para Troféus DIO, Foto de Perfil e Ícones
      {
        source: '/(images|icons)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      }
    ];
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
