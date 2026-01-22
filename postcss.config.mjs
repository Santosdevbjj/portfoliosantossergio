/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    /**
     * 1. Nesting CSS oficial compatível com Tailwind
     * Permite aninhamento de seletores sem preprocessadores externos
     */
    "tailwindcss/nesting": {},

    /**
     * 2. Tailwind CSS JIT
     * Gera apenas o CSS necessário, garantindo builds leves e rápidos
     */
    tailwindcss: {},

    /**
     * 3. Autoprefixer
     * Adiciona prefixos automáticos baseados em browserslist
     * Flexbox compatível, sem hacks antigos
     */
    autoprefixer: {
      flexbox: "no-2009",
    },

    /**
     * 4. CSSNano (produção apenas)
     * Minificação segura, preservando animações, variáveis CSS e transições
     */
    ...(process.env.NODE_ENV === "production"
      ? {
          cssnano: {
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: false, // evita quebrar Tailwind
              },
            ],
          },
        }
      : {}),
  },
};

export default config;
