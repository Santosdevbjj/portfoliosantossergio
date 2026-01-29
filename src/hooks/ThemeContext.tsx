'use client'

/**
 * THEME CONTEXT: Orquestrador de Aparência Global
 * -----------------------------------------------------------------------------
 * Gerencia a lógica de Dark Mode, Light Mode e Sincronização com o Sistema.
 * Persistência dupla: LocalStorage (Cliente) + Cookies (SSR Friendly).
 * * FOCO: Eliminar erro de build da Vercel (Unused React import).
 */

import {
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

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  /* -------------------------- DOM Application --------------------------- */

  const applyToDOM = useCallback((dark: boolean) => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    // Toggle da classe .dark para Tailwind (essencial para responsividade visual)
    root.classList.toggle('dark', dark)
    // Ajuste da cor da barra de status e scrollbars nativas
    root.style.colorScheme = dark ? 'dark' : 'light'
  }, [])

  /* -------------------------- Initial Load ------------------------------ */

  useEffect(() => {
    const getStoredTheme = (): Theme => {
      if (typeof window === 'undefined') return 'system'
      
      try {
        const stored = localStorage.getItem('theme')
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          return stored
        }

        const cookieTheme = document.cookie
          .split('; ')
          .find((row) => row.startsWith('theme='))
          ?.split('=')[1]

        if (cookieTheme === 'light' || cookieTheme === 'dark' || cookieTheme === 'system') {
          return cookieTheme as Theme
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
    if (!mounted || theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
      applyToDOM(e.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => { mediaQuery.removeEventListener('change', handler) }
  }, [theme, mounted, applyToDOM])

  /* ----------------------- Persistence ---------------------------------- */

  const saveTheme = useCallback(
    (newTheme: Theme) => {
      if (typeof window === 'undefined') return

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const shouldBeDark =
        newTheme === 'dark' ||
        (newTheme === 'system' && mediaQuery.matches)

      setTheme(newTheme)
      setIsDark(shouldBeDark)
      applyToDOM(shouldBeDark)

      try {
        if (newTheme === 'system') {
          localStorage.removeItem('theme')
        } else {
          localStorage.setItem('theme', newTheme)
        }

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
    () => { saveTheme(isDark ? 'light' : 'dark') },
    [isDark, saveTheme]
  )

  const applyTheme = useCallback(
    (newTheme: Theme) => { saveTheme(newTheme) },
    [saveTheme]
  )

  const resetTheme = useCallback(
    () => { saveTheme('system') },
    [saveTheme]
  )

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
