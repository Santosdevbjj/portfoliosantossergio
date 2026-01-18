/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ativa o modo escuro via classe (essencial para next-themes)
  darkMode: 'class',
  
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/constants/**/*.{js,ts,jsx,tsx}", // Adicionado para garantir tradução segura
  ],

  theme: {
    extend: {
      colors: {
        // Paleta Profissional: Tons de azul "Banking/Enterprise"
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae2fd',
          300: '#7cc8fb',
          400: '#38a9f8',
          500: '#0e8ce9',
          600: '#026fc7',
          700: '#0358a1',
          800: '#074b85',
          900: '#0c3f6d',
          DEFAULT: "#1e40af", // Azul Bradesco/Corporate
        },
        // Cores de fundo para modo escuro otimizado
        slate: {
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
      },
      // SISTEMA DE ANIMAÇÕES: Essencial para a UX Sênior
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      // Adiciona sombras personalizadas para os cards de projeto
      boxShadow: {
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.1)',
        'premium-dark': '0 20px 50px -12px rgba(0, 0, 0, 0.5)',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'), // Melhora a renderização de textos longos
  ],
};
