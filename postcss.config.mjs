/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // 1. Ativa o suporte a aninhamento (nesting) compatível com o Tailwind
    // Essencial para manter o código CSS limpo e legível em 2026
    'tailwindcss/nesting': {},
    
    // 2. O motor do Tailwind CSS (Processamento JIT otimizado)
    tailwindcss: {},
    
    // 3. Autoprefixer: Garante compatibilidade retroativa (Safari/Chrome antigos)
    // Configurado para o rigor técnico de Grid e Flexbox
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace', 
    },
    
    // 4. CSSNano: Minificação extrema para Produção (Foco em Core Web Vitals)
    // Isso reduz o tempo de carregamento do CSS, melhorando o LCP
    ...(process.env.NODE_ENV === 'production' 
      ? { 
          cssnano: { 
            preset: [
              'default', 
              { 
                discardComments: { removeAll: true },
                convertValues: true,
                normalizeWhitespace: true,
              }
            ] 
          } 
        } 
      : {}
    ),
  },
};

export default config;
