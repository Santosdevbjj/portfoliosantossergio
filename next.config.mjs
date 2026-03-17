// @ts-check
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Definição de extensões (Suporte a MDX)
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // 2. Configuração do Turbopack
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    // Fix para PDF.js: Evita que o Turbopack tente analisar o worker do PDF.js como um módulo JS padrão
    resolveAlias: {
      canvas: false,
      'utf-8-validate': false,
      'bufferutil': false,
    },
  },

  // 3. Permissões de Imagens (GitHub e Avatares)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/Santosdevbjj/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true, // Útil para ícones e badges de projetos
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 4. Configurações de Compilação (Otimização para Node 24/React 19)
  serverExternalPackages: ['canvas'], // Importante para bibliotecas de PDF
  
  // 5. Redirecionamentos de Segurança para os PDFs (Opcional, mas recomendado)
  async headers() {
    return [
      {
        source: '/pdf/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/pdf',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
