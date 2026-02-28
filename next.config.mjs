import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Estende as extensões de página para incluir MDX
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  options: {
    // Plugins opcionais para melhorar o Markdown
    remarkPlugins: ['remark-gfm'], 
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
