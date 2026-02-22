import type { Config } from "tailwindcss";

const config: Config = {
  // ATENÇÃO: Isso diz ao Tailwind para olhar dentro da pasta SRC
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Habilita a troca de tema baseada em classe (útil para o seu dark mode)
  darkMode: "class", 
  theme: {
    extend: {
      // Aqui você pode adicionar as cores personalizadas que usou no código
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // Adicionando suporte para o espaçamento do seu layout
      container: {
        center: true,
        padding: "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
