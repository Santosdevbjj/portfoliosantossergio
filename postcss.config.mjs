/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    /**
     * 1️⃣ PostCSS Import
     * Permite usar @import em arquivos CSS, organizando melhor o projeto.
     */
    'postcss-import': {},

    /**
     * 2️⃣ CSS Nesting (Tailwind Custom)
     * Transpila o aninhamento antes do Tailwind processar as classes.
     */
    'tailwindcss/nesting': {},

    /**
     * 3️⃣ Tailwind CSS
     * O motor principal de geração de estilos.
     */
    tailwindcss: {},

    /**
     * 4️⃣ Autoprefixer
     * Adiciona prefixos necessários para browsers modernos.
     * Configurado para a web moderna de 2026.
     */
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace',
    },

    /**
     * 5️⃣ CSSNano (Minificação em Produção)
     * Otimiza o bundle final sem quebrar funcionalidades do Tailwind.
     */
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: [
              'default',
              {
                /* Limpeza de código */
                discardComments: { removeAll: true },
                
                /* Segurança: Não renomeia IDs ou Animações (essencial para Tailwind/Framer Motion) */
                reduceIdents: false,
                mergeIdents: false,
                
                /* Segurança: Não altera a ordem de camadas Z */
                zindex: false,

                /* Performance: Otimiza cálculos e cores de forma segura */
                calc: true,
                colormin: true,
                
                /* Preservação de lógica moderna */
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
