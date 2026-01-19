module.exports = {
  plugins: {
    // Permite o uso de aninhamento (nesting) nativo do CSS seguindo a especificação W3C
    'tailwindcss/nesting': {},
    
    // Processador principal do Tailwind CSS
    tailwindcss: {},
    
    // Garante compatibilidade com browsers antigos adicionando prefixos automaticamente
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace', // Importante para garantir que o Grid do seu Portfolio funcione em browsers legados
    },
    
    // Otimização extrema para Produção
    ...(process.env.NODE_ENV === 'production' 
      ? { 
          cssnano: { 
            preset: [
              'default', 
              { 
                discardComments: { removeAll: true },
                normalizeWhitespace: true,
              }
            ] 
          } 
        } 
      : {}
    ),
  },
};
