module.exports = {
  plugins: {
    // 1. Ativa o suporte a aninhamento (nesting) compatível com o Tailwind
    // Essencial para manter o código CSS limpo e legível
    'tailwindcss/nesting': {},
    
    // 2. O motor do Tailwind CSS
    tailwindcss: {},
    
    // 3. Autoprefixer: Adiciona prefixos (ex: -webkit, -moz) automaticamente
    // Configurado para garantir que seu Grid e Flexbox sejam responsivos em todos os devices
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace', 
    },
    
    // 4. CSSNano: Minificação profissional para Produção
    // Reduz o tamanho do arquivo final removendo espaços e comentários inúteis
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
