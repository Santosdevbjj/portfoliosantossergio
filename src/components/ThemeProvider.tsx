'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

/**
 * THEME PROVIDER - ARQUITETURA NEXT.JS 15.5.9 & REACT 19
 * * Responsividade: Sincronia total com 'System Preference' (Media Queries de SO).
 * Multilingue: Infraestrutura agnóstica de idioma, preparada para suporte LTR/RTL.
 * Rigor Técnico: Resolvido erro de 'no-duplicate-imports' identificado no build da Vercel.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // O useEffect é crucial para evitar erros de hidratação (Hydration Mismatch)
  // comuns no Next.js quando o tema do servidor difere do tema do cliente.
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange 
      {...props}
    >
      {/* Estratégia de Exibição Segura:
          Mantemos o conteúdo acessível para SEO, mas aplicamos uma transição suave
          apenas após a montagem para garantir que o tema correto seja aplicado 
          sem "piscar" a tela em branco ou preta.
      */}
      <div 
        className={mounted ? "opacity-100 transition-opacity duration-300" : "opacity-0"}
        aria-hidden={!mounted}
      >
        {children}
      </div>
    </NextThemesProvider>
  );
}
