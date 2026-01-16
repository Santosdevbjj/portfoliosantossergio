/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",    // Pasta principal com App, Components, etc.
    "./app/**/*.{js,ts,jsx,tsx}",    // Fallback caso algo esteja fora de src
    "./components/**/*.{js,ts,jsx,tsx}" // Fallback para componentes na raiz
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1e40af",
          light: "#3b82f6",
          dark: "#1e3a8a"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: [
    // Nota: Verifique se estes plugins estão instalados no package.json
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio")
  ]
};
