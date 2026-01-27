'use client'

/**
 * THEME PROVIDER: Governança de Interface (Dark/Light Mode)
 * -----------------------------------------------------------------------------
 * - Engine: Baseado em 'next-themes' para manipulação de classes CSS.
 * - Performance: Otimizado para evitar FOUC (Flash of Unstyled Content).
 * - Acessibilidade: Sincroniza com as preferências do Sistema Operacional.
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

  /**
   * Safe Mounting Pattern
   * Essencial para evitar erros de hidratação (Hydration Mismatch) 
   * entre o servidor (que não conhece o tema) e o cliente.
   */
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Durante o SSR, renderizamos um fragmento transparente para manter a árvore DOM íntegra
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange // Melhora a performance ao trocar de tema
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
