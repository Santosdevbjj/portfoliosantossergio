// @ts-check
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Extensões de página para suporte a MDX e TypeScript
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // 2. Configuração do Turbopack (Next.js 16)
  // Otimizado para o motor nativo do TS 6.0
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // 3. Otimização de Imagens (GitHub e Performance)
  images: {
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
    ],
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 60,
  },

  // 4. Isolamento de pacotes para Node 24 / React 19
  // Impede falhas de Prerendering (Pipeline Error)
  serverExternalPackages: ['pdfjs-dist', 'canvas'],

  // 5. Configurações Experimentais
  experimental: {
    mdxRs: true, // Usa o compilador Rust para MDX (Mais rápido)
  }
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

// APENAS UM EXPORT DEFAULT NO FINAL DO ARQUIVO
export default withMDX(nextConfig)
