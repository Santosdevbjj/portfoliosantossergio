'use client'

/**
 * THEME CONTEXT: Orquestrador de Aparência Global
 * -----------------------------------------------------------------------------
 * REVISÃO FINAL:
 * - Removida manipulação manual de classe .dark (conflitava com next-themes).
 * - Otimizado para Next.js 16 e React 19.
 * - Mantém a interface de uso (API) para não quebrar outros componentes.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react'
import { useTheme as useNextTheme } from 'next-themes'

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  isDark: boolean
  mounted: boolean
  toggleTheme: () => void
  applyTheme: (newTheme: Theme) => void
  resetTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

/* -------------------------------------------------------------------------- */
/* PROVIDER                                                                   */
/* -------------------------------------------------------------------------- */

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  // Consumimos o motor real do tema (next-themes)
  const { theme, setTheme, resolvedTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  // Sincronização de montagem
  useEffect(() => {
    setMounted(true)
  }, [])

  /* ----------------------- Public API ----------------------------------- */

  const applyTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme)
  }, [setTheme])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const resetTheme = useCallback(() => {
    setTheme('system')
  }, [setTheme])

  // O isDark agora vem do 'resolvedTheme', que é o estado real final da interface
  const value = useMemo(() => ({
    theme: (theme as Theme) || 'system',
    isDark: resolvedTheme === 'dark',
    mounted,
    toggleTheme,
    applyTheme,
    resetTheme,
  }), [theme, resolvedTheme, mounted, toggleTheme, applyTheme, resetTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/* HOOK                                                                       */
/* -------------------------------------------------------------------------- */

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (!context) {
    // Erro amigável para debug
    throw new Error('[useThemeContext] Deve ser usado dentro de <ThemeProvider />')
  }
  return context
}
