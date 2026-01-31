/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    /**
     * 1️⃣ PostCSS Import
     * Permite usar @import em arquivos CSS
     */
    'postcss-import': {},

    /**
     * 2️⃣ CSS Nesting (Tailwind-native)
     * Deve vir ANTES do Tailwind
     */
    'tailwindcss/nesting': {},

    /**
     * 3️⃣ Tailwind CSS
     * Motor principal de estilos
     */
    tailwindcss: {},

    /**
     * 4️⃣ Autoprefixer
     * Configuração moderna (Next.js já fornece Browserslist)
     */
    autoprefixer: {},

    /**
     * 5️⃣ CSSNano (somente em produção)
     * Minificação segura para Tailwind + Framer Motion
     */
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: [
              'default',
              {
                /* Remove todos os comentários */
                discardComments: { removeAll: true },

                /* NÃO renomear animações ou IDs (essencial para Tailwind) */
                reduceIdents: false,
                mergeIdents: false,

                /* NÃO mexer em z-index (evita bugs visuais) */
                zindex: false,

                /* Otimizações seguras */
                calc: true,
                colormin: true,

                /* Preserva fontes e lógica moderna */
                minifyFontValues: { removeQuotes: false },
                discardUnused: false,
              },
            ],
          },
        }
      : {}),
  },
};

export default config;
