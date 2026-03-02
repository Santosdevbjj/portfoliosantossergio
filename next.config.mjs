import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Suporte a extensões MDX e TSX
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // 2. Configuração de Imagens Externas (GitHub)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/Santosdevbjj/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/Santosdevbjj/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
    // Otimização de cache para imagens remotas em produção
    minimumCacheTTL: 60,
  },

  // 3. Melhorias de Performance (Next 16)
  experimental: {
    // Ativa otimizações específicas para o Turbopack se necessário
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [], // Removido 'remark-gfm' como string se não estiver instalado via npm
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
