/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    /**
     * 1. Nesting CSS padrão (PostCSS oficial)
     * Mais estável e compatível com Turbopack e Next.js 16
     */
    "postcss-nesting": {},

    /**
     * 2. Tailwind CSS (JIT engine)
     */
    tailwindcss: {},

    /**
     * 3. Autoprefixer
     * Compatibilidade automática baseada em browserslist
     * (Evita CSS inflado e hacks desnecessários)
     */
    autoprefixer: {
      flexbox: "no-2009",
    },

    /**
     * 4. CSSNano (somente em produção)
     * Minificação segura, sem quebrar layouts ou animações
     */
    ...(process.env.NODE_ENV === "production"
      ? {
          cssnano: {
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }
      : {}),
  },
};

export default config;
