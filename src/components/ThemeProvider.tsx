'use client'

/**
 * THEME PROVIDER: Governança de Interface (Dark/Light Mode)
 * -----------------------------------------------------------------------------
 * Revisão Sênior:
 * 1. Adicionado suppressHydrationWarning para evitar erros de servidor/cliente.
 * 2. Garantia de que o conteúdo não cause "layout shift" durante o carregamento.
 */

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // O useEffect garante que o código só rode no navegador
  React.useEffect(() => {
    setMounted(true)
  }, [])

  /**
   * Padrão Sênior: No Next.js 16, se retornarmos apenas os children antes de montar,
   * o HTML final pode divergir do inicial. 
   * Usamos um wrapper simples ou apenas o Provider com a lógica de montagem.
   */
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <div 
        style={{ visibility: mounted ? 'visible' : 'hidden' }} 
        suppressHydrationWarning
      >
        {children}
      </div>
    </NextThemesProvider>
  )
}
