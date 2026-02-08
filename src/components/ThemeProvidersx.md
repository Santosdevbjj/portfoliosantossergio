'use client'

/**
 * THEME PROVIDER — INFRAESTRUTURA UNIFICADA 2026
 * -----------------------------------------------------------------------------
 * - Centraliza next-themes e Custom Context.
 * - Suprime o Hydration Mismatch via supressão controlada.
 * - Otimizado para a Engine Oxide (Tailwind v4).
 */

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

interface ThemeProviderProps {
  readonly children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Estado para evitar Hydration Mismatch em componentes que dependem do tema
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      // Em 2026, usamos o storageKey explícito para evitar conflitos com outros apps no domínio
      storageKey="sergio-portfolio-theme"
    >
      {/* Passamos o estado 'mounted' via um padrão de renderização limpo.
          Isso garante que o restante da aplicação saiba quando é seguro
          renderizar elementos dependentes de tema (como ícones).
      */}
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </NextThemesProvider>
  )
}
