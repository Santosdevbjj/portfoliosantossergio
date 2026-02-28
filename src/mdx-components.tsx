import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Permite estilizar títulos, links, etc.
    h1: ({ children }) => <h1 className="text-4xl font-bold my-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-semibold my-3">{children}</h2>,
    p: ({ children }) => <p className="text-base leading-7 my-2">{children}</p>,
    ...components,
  }
}
