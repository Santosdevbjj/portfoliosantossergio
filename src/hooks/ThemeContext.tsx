'use client'

/**
 * THEME CONTEXT: Orquestrador de Aparência Global
 * -----------------------------------------------------------------------------
 * Gerencia a lógica de Dark Mode, Light Mode e Sincronização com o Sistema.
 * Persistência dupla: LocalStorage (Cliente) + Cookies (SSR Friendly).
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'

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

/* -------------------------------------------------------------------------- */
/* CONTEXT                                                                    */
/* -------------------------------------------------------------------------- */

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

/* -------------------------------------------------------------------------- */
/* PROVIDER                                                                   */
/* -------------------------------------------------------------------------- */

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  /* -------------------------- DOM Application --------------------------- */

  const applyToDOM = useCallback((dark: boolean) => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    // Toggle da classe .dark para Tailwind
    root.classList.toggle('dark', dark)
    // Ajuste da cor da barra de status e scrollbars nativas
    root.style.colorScheme = dark ? 'dark' : 'light'
  }, [])

  /* -------------------------- Initial Load ------------------------------ */

  useEffect(() => {
    const getStoredTheme = (): Theme => {
      if (typeof window === 'undefined') return 'system'
      
      try {
        // Prioridade 1: LocalStorage (Preferência explícita do usuário)
        const stored = localStorage.getItem('theme')
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          return stored
        }

        // Prioridade 2: Cookies (Útil para o servidor Next.js ler antes do render)
        const cookieTheme = document.cookie
          .split('; ')
          .find((row) => row.startsWith('theme='))
          ?.split('=')[1]

        if (cookieTheme === 'light' || cookieTheme === 'dark' || cookieTheme === 'system') {
          return cookieTheme
        }
      } catch (e) {
        console.warn('[ThemeContext] Erro ao ler armazenamento:', e)
      }

      return 'system'
    }

    const initialTheme = getStoredTheme()
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const shouldBeDark =
      initialTheme === 'dark' ||
      (initialTheme === 'system' && mediaQuery.matches)

    setTheme(initialTheme)
    setIsDark(shouldBeDark)
    applyToDOM(shouldBeDark)
    setMounted(true)
  }, [applyToDOM])

  /* ----------------------- System Theme Sync ---------------------------- */

  useEffect(() => {
    // Só sincroniza se o usuário estiver no modo 'system'
    if (!mounted || theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
      applyToDOM(e.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme, mounted, applyToDOM])

  /* ----------------------- Persistence ---------------------------------- */

  const saveTheme = useCallback(
    (newTheme: Theme) => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const shouldBeDark =
        newTheme === 'dark' ||
        (newTheme === 'system' && mediaQuery.matches)

      setTheme(newTheme)
      setIsDark(shouldBeDark)
      applyToDOM(shouldBeDark)

      try {
        // Persiste no LocalStorage
        if (newTheme === 'system') {
          localStorage.removeItem('theme')
        } else {
          localStorage.setItem('theme', newTheme)
        }

        // Persiste no Cookie para o Middleware/SSR
        const isSecure = window.location.protocol === 'https:' ? 'Secure;' : ''
        document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax; ${isSecure}`
      } catch (e) {
        console.error('[ThemeContext] Falha ao salvar tema:', e)
      }
    },
    [applyToDOM]
  )

  /* ----------------------- Public API ----------------------------------- */

  const toggleTheme = useCallback(
    () => saveTheme(isDark ? 'light' : 'dark'),
    [isDark, saveTheme]
  )

  const applyTheme = useCallback(
    (newTheme: Theme) => saveTheme(newTheme),
    [saveTheme]
  )

  const resetTheme = useCallback(
    () => saveTheme('system'),
    [saveTheme]
  )

  // Memoização do valor do contexto para evitar re-renders desnecessários
  const value = useMemo(() => ({
    theme,
    isDark,
    mounted,
    toggleTheme,
    applyTheme,
    resetTheme,
  }), [theme, isDark, mounted, toggleTheme, applyTheme, resetTheme])

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
    throw new Error('[useThemeContext] Erro: Este hook deve ser usado dentro de um <ThemeProvider />')
  }
  return context
}
