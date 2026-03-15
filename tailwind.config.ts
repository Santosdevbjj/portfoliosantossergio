// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  // O darkMode 'class' permite que o prose-invert funcione
  // quando você alternar o tema do sistema
  darkMode: 'class',
  
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}" // Garante que o src/ seja scaneado
  ],
  
  theme: {
    extend: {
      // Aqui você pode adicionar personalizações extras para o 'prose' se desejar
    },
  },
  
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
