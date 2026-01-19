'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';

/**
 * THEME PROVIDER - ADAPTADO PARA PORTFÓLIO SÊNIOR
 * * Este componente é o "invólucro" que permite ao Tailwind CSS aplicar as classes
 * de modo escuro (dark mode) em toda a árvore de componentes.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  /**
   * HIDRATAÇÃO (SSR vs Client)
   * No celular, o processamento pode demorar milissegundos a mais. 
   * O useEffect garante que o tema só seja aplicado quando o navegador estiver pronto,
   * evitando aquele "flash" branco antes de ficar escuro.
   */
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Enquanto o componente não monta, renderizamos um conteúdo "neutro"
  // para manter a estabilidade visual (CLS - Cumulative Layout Shift)
  if (!mounted) {
    return (
      <div className="contents" style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange // Melhora a performance em dispositivos móveis
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
