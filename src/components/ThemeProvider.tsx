'use client'

/**
 * THEME PROVIDER - PORTÃO DE ENTRADA UNIFICADO
 * -----------------------------------------------------------------------------
 * Revisão: Sincronizado com a unificação do ThemeToggle.
 * - Elimina o "Flash" de cores erradas no carregamento.
 * - Atua como um Wrapper de infraestrutura para o Next.js 16.
 * - Integração: Utiliza o Provider unificado do @/components/ThemeToggle.
 */

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProvider as CustomLogicProvider } from './ThemeToggle'

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Estado de montagem para evitar Hydration Mismatch no servidor
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
      {...props}
    >
      {/* O CustomLogicProvider (do ThemeToggle) injeta nossas funções 
          de toggleTheme() e isDark em toda a aplicação.
      */}
      <CustomLogicProvider>
        <div 
          className={mounted ? 'contents' : 'invisible'} 
          suppressHydrationWarning
        >
          {children}
        </div>
      </CustomLogicProvider>
    </NextThemesProvider>
  )
}
