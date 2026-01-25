/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    /**
     * 1. CSS Nesting (oficial Tailwind)
     * Permite aninhamento nativo sem preprocessadores
     * Compatível com Tailwind JIT e futuro Tailwind v4
     */
    'tailwindcss/nesting': {},

    /**
     * 2. Tailwind CSS
     * Geração JIT — apenas utilitários realmente usados
     * Essencial manter antes de autoprefixer e cssnano
     */
    tailwindcss: {},

    /**
     * 3. Autoprefixer
     * Prefixos automáticos baseados em browserslist
     * Flexbox moderno, sem suporte legado desnecessário
     */
    autoprefixer: {
      flexbox: 'no-2009',
    },

    /**
     * 4. CSSNano — apenas em produção
     * Minificação segura para Tailwind, animações e CSS variables
     */
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: [
              'advanced',
              {
                discardComments: {
                  removeAll: true,
                },

                // ⚠️ CRÍTICO para Tailwind / animações
                reduceIdents: false,
                zindex: false,
                mergeIdents: false,

                // Mantém CSS variables intactas
                reduceVars: false,

                // Evita quebrar grid/flex modernos
                normalizeWhitespace: false,
                cssDeclarationSorter: false,
              },
            ],
          },
        }
      : {}),
  },
}

export default config
