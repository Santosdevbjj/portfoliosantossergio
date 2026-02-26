/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Na v4, este plugin gerencia tudo: detecção de arquivos, 
    // processamento de variáveis CSS e autoprefixer.
    "@tailwindcss/postcss": {},
  },
};

export default config;
