'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';

/**
 * THEME PROVIDER - ARQUITETURA NEXT.JS 15
 * * Responsividade: Utiliza 'enableSystem' para sincronizar com o modo noturno do iOS/Android.
 * Multilingue: Como é um componente de infraestrutura, ele não traduz textos, mas 
 * garante que o layout (LTR/RTL) e as cores estejam prontos para qualquer idioma.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // O useEffect garante a sincronização entre o servidor e o cliente (Hydration)
  React.useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * ESTRATÉGIA DE RENDERIZAÇÃO:
   * Para evitar o 'flash' de hidratação e melhorar o Core Web Vitals (LCP),
   * renderizamos os filhos normalmente, mas o NextThemesProvider só assume
   * o controle após a montagem.
   */
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange // Essencial para evitar flickering ao navegar entre páginas
      {...props}
    >
      <div 
        className={`transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </div>
    </NextThemesProvider>
  );
}
