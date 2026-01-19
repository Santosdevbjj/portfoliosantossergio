module.exports = {
  plugins: {
    // Motor de estilização principal
    'tailwindcss/nesting': {}, // Permite aninhamento de CSS estilo Sass (opcional, mas recomendado)
    tailwindcss: {},
    
    // Adiciona prefixos (ex: -webkit, -moz) automaticamente para compatibilidade de browsers
    autoprefixer: {
      flexbox: 'no-2009',
    },
    
    // Otimização de produção: Minificação de CSS
    ...(process.env.NODE_ENV === 'production' ? { cssnano: { preset: 'default' } } : {})
  },
};
