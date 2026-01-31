'use client'

/**
 * THEME SYSTEM UNIFIED — SÉRGIO SANTOS (2026)
 * -----------------------------------------------------------------------------
 * - Responsivo: Área de toque acessível + Safe Areas
 * - Multilíngue: PT / EN / ES via pathname
 * - Acessível: ARIA + prefers-color-scheme
 * - Framework: Next.js 16 + React 19
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
import { Moon, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme as useNextTheme } from 'next-themes'

/* -------------------------------------------------------------------------- */
/* 1. TYPES & CONTEXT                                                          */
/* -------------------------------------------------------------------------- */

export type ThemeType = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: ThemeType
  isDark: boolean
  mounted: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/* -------------------------------------------------------------------------- */
/* 2. THEME PROVIDER                                                           */
/* -------------------------------------------------------------------------- */

export function ThemeProvider({
  children,
}: {
  readonly children: ReactNode
}) {
  const { theme, setTheme, resolvedTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: (theme as ThemeType) ?? 'system',
      isDark: resolvedTheme === 'dark',
      mounted,
      toggleTheme,
    }),
    [theme, resolvedTheme, mounted, toggleTheme]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/* 3. CUSTOM HOOK                                                              */
/* -------------------------------------------------------------------------- */

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  const nextTheme = useNextTheme()

  if (!context) {
    return {
      theme: (nextTheme.theme as ThemeType) ?? 'system',
      isDark: nextTheme.resolvedTheme === 'dark',
      mounted: true,
      toggleTheme: () =>
        nextTheme.setTheme(
          nextTheme.resolvedTheme === 'dark' ? 'light' : 'dark'
        ),
    }
  }

  return context
}

/* -------------------------------------------------------------------------- */
/* 4. THEME TOGGLE COMPONENT (UI)                                              */
/* -------------------------------------------------------------------------- */

type Lang = 'pt' | 'en' | 'es'

export function ThemeToggle() {
  const pathname = usePathname()
  const { toggleTheme, isDark, mounted } = useTheme()

  /* --- Detecção de idioma robusta --- */
  const lang = useMemo<Lang>(() => {
    if (!pathname) return 'pt'
    const segment = pathname.split('/')[1]?.toLowerCase()
    return segment === 'en' || segment === 'es' ? segment : 'pt'
  }, [pathname])

  const labels: Record<Lang, { dark: string; light: string }> = {
    pt: {
      dark: 'Ativar modo escuro',
      light: 'Ativar modo claro',
    },
    en: {
      dark: 'Enable dark mode',
      light: 'Enable light mode',
    },
    es: {
      dark: 'Activar modo oscuro',
      light: 'Activar modo claro',
    },
  }

  /* --- Skeleton durante hidratação --- */
  if (!mounted) {
    return (
      <div
        className="
          min-w-[44px] min-h-[44px]
          rounded-xl
          bg-slate-200/60 dark:bg-slate-800/60
          border border-slate-200 dark:border-slate-800
          animate-pulse
        "
        aria-hidden="true"
      />
    )
  }

  const t = labels[lang]
  const currentLabel = isDark ? t.light : t.dark

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={currentLabel}
      aria-pressed={isDark}
      title={currentLabel}
      className="
        relative
        min-w-[44px] min-h-[44px]
        p-2.5
        rounded-xl
        bg-white/80 dark:bg-slate-900/80
        border border-slate-200 dark:border-slate-800/60
        shadow-sm backdrop-blur-md
        text-slate-600 dark:text-slate-400
        hover:text-blue-600 dark:hover:text-amber-400
        hover:border-blue-500/30 dark:hover:border-amber-500/30
        transition-all duration-300
        group active:scale-95
        focus:outline-none
        focus-visible:ring-2 focus-visible:ring-blue-500
        focus-visible:ring-offset-2
        focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900
        supports-[padding:env(safe-area-inset-top)]:p-[calc(0.625rem+env(safe-area-inset-top))]
      "
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {/* Sol — aparece quando Dark */}
        <Sun
          size={20}
          className={`
            absolute transition-all duration-500
            ${
              isDark
                ? 'translate-y-0 opacity-100 rotate-0'
                : 'translate-y-8 opacity-0 rotate-45'
            }
          `}
        />

        {/* Lua — aparece quando Light */}
        <Moon
          size={20}
          className={`
            absolute transition-all duration-500
            ${
              !isDark
                ? 'translate-y-0 opacity-100 rotate-0'
                : '-translate-y-8 opacity-0 -rotate-45'
            }
          `}
        />
      </div>
    </button>
  )
}
