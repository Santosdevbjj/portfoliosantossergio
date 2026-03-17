// @ts-check
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Extensões de página
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // 2. Configuração do Turbopack (Next.js 16)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    // Forçamos o Turbopack a ignorar bibliotecas que dependem de C++ ou Node.js nativo
    resolveAlias: {
      'canvas': 'empty-module',
      'utf-8-validate': 'empty-module',
      'bufferutil': 'empty-module',
      'pdfjs-dist': 'empty-module', // Evita o erro de 'pipeline' no prerender
    },
  },

  // 3. Configurações de Imagens
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

  // 4. Node 24 / React 19 / Estabilidade de Build
  // canvas deve ser tratado como externo sempre
  serverExternalPackages: ['canvas'],

  // 5. Headers para os arquivos de currículo na pasta public
  async headers() {
    return [
      {
        source: '/pdf/(.*).pdf',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/pdf',
          },
          {
            key: 'Content-Disposition',
            value: 'inline', // Permite visualizar no navegador antes de baixar
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
