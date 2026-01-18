/** @type {import('tailwindcss').Config} */
module.exports = {
  // ATENÇÃO: Esta linha é essencial para o next-themes funcionar!
  darkMode: 'class',
  
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // Adicionado para garantir que cubra todas as pastas do Next.js 15
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
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
      },
      // Adicionado para suportar as animações do seu template.tsx e switcher
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    }
  },
  plugins: []
};
