


// @ts-check
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Definição de extensões (Suporte a MDX)
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // 2. Configuração correta para o Turbopack (conforme a nova doc)
  // Mudou de experimental.turbo para o nível superior 'turbopack'
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // 3. Permissões de Imagens do GitHub
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
  },
}

const withMDX = createMDX({
  options: {
    // Plugins de Markdown
    remarkPlugins: [], 
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig) 





