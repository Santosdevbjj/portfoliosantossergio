'use client'

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
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes'

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

const ThemeContext = createContext<ThemeContextValue | null>(null)

/* -------------------------------------------------------------------------- */
/* 2. THEME PROVIDER (OPTIMIZED FOR NEXT 16 / REACT 19)                       */
/* -------------------------------------------------------------------------- */

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange
    >
      <ThemeContentProvider mounted={mounted}>
        {children}
      </ThemeContentProvider>
    </NextThemesProvider>
  )
}

function ThemeContentProvider({ children, mounted }: { children: ReactNode, mounted: boolean }) {
  const { theme, setTheme, resolvedTheme } = useNextTheme()

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const value = useMemo<ThemeContextValue>(() => ({
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
/* 3. CUSTOM HOOK & UI                                                        */
/* -------------------------------------------------------------------------- */

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}

export function ThemeToggle() {
  const pathname = usePathname()
  const { toggleTheme, isDark, mounted } = useTheme()

  // i18n Strategy - Simplificada para 2026
  const labels = {
    pt: { dark: 'Ativar modo escuro', light: 'Ativar modo claro' },
    en: { dark: 'Enable dark mode', light: 'Enable light mode' },
    es: { dark: 'Activar modo oscuro', light: 'Activar modo claro' },
  }

  const lang = (pathname?.split('/')[1]?.toLowerCase() as keyof typeof labels) || 'pt'
  const t = labels[lang] || labels.pt
  const currentLabel = isDark ? t.light : t.dark

  // Estado de Skeleton durante Hydration
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
      className={`
        group relative w-11 h-11 flex items-center justify-center rounded-xl 
        bg-white/80 dark:bg-slate-900/80 
        border border-slate-200 dark:border-slate-800/60 
        shadow-sm backdrop-blur-md
        hover:border-blue-500/50 dark:hover:border-amber-500/50
        transition-all duration-300 active:scale-90
      `}
    >
      <div className="relative w-5 h-5 overflow-hidden">
        {/* Ícone Sol: Aparece no escuro para mudar para o claro */}
        <Sun 
          size={20} 
          aria-hidden={!isDark}
          className={`
            absolute inset-0 transform transition-all duration-500 ease-spring
            text-amber-500
            ${isDark ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-8 opacity-0 -rotate-90'}
          `} 
        />
        {/* Ícone Lua: Aparece no claro para mudar para o escuro */}
        <Moon 
          size={20} 
          aria-hidden={isDark}
          className={`
            absolute inset-0 transform transition-all duration-500 ease-spring
            text-slate-600 dark:text-slate-400
            ${!isDark ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-8 opacity-0 rotate-90'}
          `} 
        />
      </div>
      
      {/* Efeito de brilho sutil no hover (Tailwind v4 ring) */}
      <span className="absolute inset-0 rounded-xl ring-0 ring-blue-500/20 group-hover:ring-4 transition-all duration-300" />
    </button>
  )
}
