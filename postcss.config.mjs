/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // 1. Permite o uso de @import (essencial para organizar seu CSS)
    'postcss-import': {},

    // 2. Permite o uso de CSS Nesting (padrão moderno de 2026)
    'tailwindcss/nesting': {},

    // 3. O motor do Tailwind
    tailwindcss: {},

    // 4. Adiciona prefixos para navegadores antigos automaticamente
    autoprefixer: {},
  },
};

export default config;
