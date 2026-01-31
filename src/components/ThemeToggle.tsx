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
/* 2. THEME PROVIDER (CORRIGIDO PARA REACT 19 / NEXT 16)                      */
/* -------------------------------------------------------------------------- */

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Envolvemos o seu Contexto dentro do Provider do next-themes para garantir 
  // que o 'class="dark"' seja aplicado corretamente ao <html>
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

// Componente auxiliar para acessar o useNextTheme com segurança
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
/* 3. CUSTOM HOOK & UI (TEMA/BOTÃO)                                           */
/* -------------------------------------------------------------------------- */

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}

export function ThemeToggle() {
  const pathname = usePathname()
  const { toggleTheme, isDark, mounted } = useTheme()

  const lang = useMemo(() => {
    const segment = pathname?.split('/')[1]?.toLowerCase()
    return (segment === 'en' || segment === 'es') ? segment : 'pt'
  }, [pathname])

  const labels = {
    pt: { dark: 'Ativar modo escuro', light: 'Ativar modo claro' },
    en: { dark: 'Enable dark mode', light: 'Enable light mode' },
    es: { dark: 'Activar modo oscuro', light: 'Activar modo claro' },
  }

  if (!mounted) return <div className="w-11 h-11 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />

  const t = labels[lang as keyof typeof labels]
  const currentLabel = isDark ? t.light : t.dark

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={currentLabel}
      className="relative w-11 h-11 p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/60 shadow-sm backdrop-blur-md text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-amber-400 transition-all active:scale-95"
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        <Sun size={20} className={`absolute transition-all duration-500 ${isDark ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} />
        <Moon size={20} className={`absolute transition-all duration-500 ${!isDark ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`} />
      </div>
    </button>
  )
}
