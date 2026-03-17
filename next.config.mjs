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
    // Correção FATAL: Turbopack não aceita 'false'. 
    // Mapeamos para strings vazias para neutralizar módulos de Node.js no navegador.
    resolveAlias: {
      canvas: 'empty-module',
      'utf-8-validate': 'empty-module',
      bufferutil: 'empty-module',
    },
  },

  // 3. Permissões de Imagens
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
    dangerouslyAllowSVG: true,
  },

  // 4. Otimização para Node 24 / React 19
  // Impede que o Next tente processar o 'canvas' no lado do servidor
  serverExternalPackages: ['canvas', 'pdfjs-dist'],
  
  // 5. Headers para PDFs
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
            value: 'public, max-age=31536000, immutable',
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
