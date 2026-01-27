import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  /* ---------------------------------------------------------------------- */
  /* CORE CONFIG                                                            */
  /* ---------------------------------------------------------------------- */
  darkMode: 'class',
  
  // Otimizado para o motor de scan do Next.js 16
  content: [
    './src/**/*.{js,ts,jsx,tsx,md,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '4rem',
      },
    },

    extend: {
      /* ------------------------------ Breakpoints ----------------------- */
      screens: {
        'xs': '375px',
        '2xl': '1440px', // Padrão para monitores UltraWide de devs
      },

      /* ------------------------------ Colors ---------------------------- */
      colors: {
        brand: {
          50: 'rgb(var(--brand-50) / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          800: 'rgb(var(--brand-800) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)',
          DEFAULT: 'rgb(var(--brand-500) / <alpha-value>)',
        },
        slate: {
          950: '#020617', // OLED Dark
        },
      },

      /* ------------------------------ Typography ------------------------ */
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        heading: ['var(--font-montserrat)', 'sans-serif'],
      },

      /* ------------------------------ Animations ------------------------ */
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },

      /* ------------------------------ Effects --------------------------- */
      boxShadow: {
        premium: '0 20px 50px -12px rgba(0, 0, 0, 0.08)',
        'premium-dark': '0 20px 50px -12px rgba(0, 0, 0, 0.4)',
        glow: '0 0 20px rgba(var(--brand-500), 0.3)',
      },
    },
  },

  /* ---------------------------------------------------------------------- */
  /* PLUGINS                                                                */
  /* ---------------------------------------------------------------------- */
  plugins: [
    typography,
    // Plugin utilitário para forçar estados de hover em dispositivos touch
    require('tailwindcss-animate'),
  ],
}

export default config
