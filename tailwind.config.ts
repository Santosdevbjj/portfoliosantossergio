// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"// Garante que o src/ seja scaneado
  ], theme: {
    extend: {}}, plugins: []} satisfies Config
