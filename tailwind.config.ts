import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  /* ---------------------------------------------------------------------- */
  /* CORE CONFIG                                                            */
  /* ---------------------------------------------------------------------- */
  darkMode: 'class',
  
  // Caminhos otimizados para o motor de scan do Next.js 16 / Turbopack
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.css',
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
        '2xl': '1440px', 
      },

      /* ------------------------------ Colors ---------------------------- */
      colors: {
        // Cores Semânticas (Necessárias para Shadcn/UI e Reset Global)
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        
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
          950: '#020617', // OLED Dark Mode Pure
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
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
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
        // Glow sincronizado com o sistema RGB raw
        glow: '0 0 20px rgb(var(--brand-500) / 0.3)',
      },
    },
  },

  /* ---------------------------------------------------------------------- */
  /* PLUGINS                                                                */
  /* ---------------------------------------------------------------------- */
  plugins: [
    typography,
    // Garanta que 'npm install tailwindcss-animate' foi executado
    require('tailwindcss-animate'),
  ],
}

export default config
