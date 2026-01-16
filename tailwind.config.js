/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",   // cobre todos os arquivos dentro de src/
    "./app/**/*.{js,ts,jsx,tsx}",   // cobre o App Router do Next.js 15
    "./components/**/*.{js,ts,jsx,tsx}", // cobre componentes fora de src/app
    "./pages/**/*.{js,ts,jsx,tsx}", // se ainda usar Pages Router
    "./node_modules/lucide-react/dist/**/*.js" // garante que ícones do lucide-react sejam escaneados
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1e40af", // azul exemplo
          light: "#3b82f6",
          dark: "#1e3a8a"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio")
  ]
};
