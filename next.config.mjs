export default withMDX(nextConfig)
// @ts-check
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Extensões de página para suporte a MDX e TypeScript
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // 2. Configuração do Turbopack (Next.js 16)
  // Mantemos simples para evitar conflitos com o motor de inferência do TS 6.0
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
    dangerouslyAllowSVG: true, // Necessário para badges e ícones técnicos
    minimumCacheTTL: 60,
  },

  // 4. Isolamento de pacotes problemáticos no Node 24 / React 19
  // Isso resolve o erro de 'pipeline' retirando essas libs do bundle do servidor
  serverExternalPackages: ['pdfjs-dist', 'canvas'],

  // 5. Configurações Experimentais para Estabilidade (Opcional)
  experimental: {
    // Garante que o MDX use o novo motor do React 19
    mdxRs: true,
  }
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
