import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  // Ativa o modo escuro via classe para sincronia total com 'next-themes'
  darkMode: 'class',
  
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/constants/**/*.{js,ts,jsx,tsx,mdx}", 
  ],

  theme: {
    extend: {
      screens: {
        // Breakpoint para dispositivos ultra-compactos (iPhone SE / Smartwatches)
        'xs': '375px',
      },
      colors: {
        // Paleta "Enterprise Intelligence": Azul confiança e clareza de dados
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae2fd',
          300: '#7cc8fb',
          400: '#38a9f8',
          500: '#0e8ce9', // Azul principal para botões e links
          600: '#026fc7',
          700: '#0358a1',
          800: '#074b85',
          900: '#0c3f6d',
          DEFAULT: "#1e40af", 
        },
        // Escuro Profundo OLED (Otimizado para economia de bateria e conforto visual)
        slate: {
          950: '#020617',
        }
      },
      fontFamily: {
        // Variáveis CSS integradas com next/font (Inter e Montserrat)
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        heading: ["var(--font-montserrat)", "sans-serif"],
      },
      // SISTEMA DE UX DINÂMICA (Performance 60fps)
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 6s ease-in-out infinite',
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
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        // Efeito Glassmorphism e profundidade de camadas
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.08)',
        'premium-dark': '0 20px 50px -12px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 20px rgba(14, 140, 233, 0.3)',
      },
      backgroundImage: {
        // Padrão de grade otimizado (SVG inline com opacidade controlada)
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%2394a3b8' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
      }
    }
  },
  plugins: [
    typography, 
  ],
};

export default config;
