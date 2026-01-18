'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';

/**
 * ThemeProvider
 * * Este componente atua como a espinha dorsal do design system (Tailwind CSS).
 * Ele permite que o atributo 'class="dark"' seja injetado dinamicamente no <html>.
 * * Responsividade: Indireta (Permite que o design responsivo mude cores conforme o tema).
 * Multilingue: Indireta (Garante que a UI traduzida seja legível em qualquer contraste).
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // Garante que o provider só atue após a montagem no cliente,
  // prevenindo discrepâncias entre o HTML do servidor e do navegador.
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Renderiza o conteúdo sem o provider durante o primeiro frame para evitar 'flicker'
    return <>{children}</>;
  }

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
