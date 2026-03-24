// @ts-check
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Extensões de Página para Suporte a Artigos MDX e Código TS
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // 2. Estabilização Next.js 16.2: PPR agora é 'cacheComponents'
  cacheComponents: true,

  // 3. AI-Assisted: Logs do Browser encaminhados para o terminal de desenvolvimento
  logging: {
    fetches: { fullUrl: true },
    // @ts-ignore - Propriedade estável na 16.2 para integração com Agents
    browserToTerminal: true, 
  },

  // 4. Configuração do Turbopack (Engine Rust nativa da 16.2)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    // Ignora avisos ruidosos de bibliotecas de PDF no terminal
    ignoreIssue: [
      { path: '**/node_modules/react-pdf/**', title: 'Module not found' },
      { path: '**/node_modules/pdfjs-dist/**', title: 'Critical dependency' }
    ]
  },

  // 5. Otimização de Imagens (Fotos, Troféus DIO e GitHub)
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
    // Aumentado para 4h para melhorar o cache de ativos estáticos da DIO/GitHub
    minimumCacheTTL: 14400, 
  },

  // 6. Suporte Nativo para Pacotes Externos (Node.js 24+)
  // Na 16.2, isso garante que o Sharp e o PDF.js funcionem fora do bundle do client
  serverExternalPackages: [
    'pdfjs-dist', 
    'canvas', 
    'sharp', 
    'react-pdf', 
    'gray-matter',
    'octokit'
  ],

  // 7. Configurações Experimentais Refinadas de 2026
  experimental: {
    mdxRs: true, // MDX escrito em Rust para velocidade extrema
    taint: true, // Proteção contra vazamento de dados do servidor
    appNewScrollHandler: true, // Novo sistema de foco e scroll nativo
    prefetchInlining: true, // Agrupa prefetches para reduzir requests em redes móveis
  },

  // 8. Segurança e Cache de Assets (Multilíngue: PT, EN, ES-ES, ES-AR, ES-MX)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }
        ],
      },
      // Cache Imutável para os Currículos e Imagens de Redes Sociais
      {
        source: '/(pdf|og|images|icons|artigos)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ],
      },
      // Headers específicos para garantir que os PDFs abram corretamente no browser
      {
        source: '/pdf/:path*.pdf',
        headers: [
          { key: 'Content-Type', value: 'application/pdf' },
          { key: 'Content-Disposition', value: 'inline' }
        ],
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
