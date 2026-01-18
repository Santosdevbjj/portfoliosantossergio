'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

/**
 * ThemeProvider - Wrapper para o next-themes compatível com Next.js 15.
 * Este componente deve envolver o conteúdo no RootLayout para permitir
 * a troca dinâmica entre temas Light, Dark e System.
 * * O uso de 'suppressHydrationWarning' no arquivo layout.tsx é essencial
 * em conjunto com este provider.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
