'use client'

/**
 * THEME PROVIDER — INFRAESTRUTURA GLOBAL
 * -----------------------------------------------------------------------------
 * - Fonte única de verdade para next-themes
 * - Elimina Flash de tema incorreto (FOUC)
 * - Totalmente compatível com ThemeToggle.tsx
 * - Pronto para Next.js 16 / React 19
 */

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

interface ThemeProviderProps {
  readonly children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
