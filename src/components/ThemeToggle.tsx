'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes'
import type { Locale } from '@/types/dictionary'

/* -------------------------------------------------------------------------- */
/* 1. TYPES & CONTEXT                                                         */
/* -------------------------------------------------------------------------- */

export type ThemeType = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: ThemeType
  isDark: boolean
  mounted: boolean
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

/* -------------------------------------------------------------------------- */
/* 2. UNIFIED INFRASTRUCTURE PROVIDER                                         */
/* -------------------------------------------------------------------------- */

export function ThemeProvider({ children }: { readonly children: React.ReactNode }) {
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
      storageKey="sergio-portfolio-theme"
    >
      <ThemeInternalProvider mounted={mounted}>
        {/* Camada de visibilidade para evitar flash de cores incorretas */}
        <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
          {children}
        </div>
      </ThemeInternalProvider>
    </NextThemesProvider>
  )
}

function ThemeInternalProvider({ children, mounted }: { children: React.ReactNode, mounted: boolean }) {
  const { theme, setTheme, resolvedTheme } = useNextTheme()

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const value = React.useMemo<ThemeContextValue>(() => ({
    theme: (theme as ThemeType) ?? 'system',
    isDark: resolvedTheme === 'dark',
    mounted,
    toggleTheme,
  }), [theme, resolvedTheme, mounted, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/* 3. CUSTOM HOOK & UI TOGGLE                                                 */
/* -------------------------------------------------------------------------- */

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}

export function ThemeToggle() {
  const pathname = usePathname()
  const { toggleTheme, isDark, mounted } = useTheme()

  // i18n Strategy - Alinhada com os dicionários e variações regionais
  const labels = {
    pt: { dark: 'Ativar modo escuro', light: 'Ativar modo claro' },
    en: { dark: 'Enable dark mode', light: 'Enable light mode' },
    es: { dark: 'Activar modo oscuro', light: 'Activar modo claro' },
  }

  // Detecta o locale via URL (ex: /es-MX/...) e aplica fallback inteligente
  const langRaw = pathname?.split('/')[1] as Locale | undefined
  const langKey = langRaw?.split('-')[0] as keyof typeof labels // 'pt', 'en' ou 'es'
  const t = labels[langKey] || labels.pt
  const currentLabel = isDark ? t.light : t.dark

  if (!mounted) {
    return (
      <div className="w-11 h-11 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse border border-transparent" />
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={currentLabel}
      title={currentLabel}
      className="group relative w-11 h-11 flex items-center justify-center rounded-xl 
                 bg-white/80 dark:bg-slate-900/80 border border-slate-200 
                 dark:border-slate-800/60 shadow-sm backdrop-blur-md
                 hover:border-blue-500/50 dark:hover:border-amber-500/50
                 transition-all duration-300 active:scale-95"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        <Sun 
          size={20} 
          className={`absolute inset-0 transform transition-all duration-500 text-amber-500
            ${isDark ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-8 opacity-0 -rotate-90'}`} 
        />
        <Moon 
          size={20} 
          className={`absolute inset-0 transform transition-all duration-500 text-slate-600 dark:text-slate-400
            ${!isDark ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-8 opacity-0 rotate-90'}`} 
        />
      </div>
      <span className="absolute inset-0 rounded-xl ring-0 ring-blue-500/20 group-hover:ring-4 transition-all duration-300" />
    </button>
  )
}
