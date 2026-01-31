'use client'

/**
 * THEME SYSTEM UNIFIED — SÉRGIO SANTOS (2026)
 * -----------------------------------------------------------------------------
 * Unifica: Contexto, Hook Customizado e Componente UI.
 * - Responsividade: Feedback tátil (active:scale-95) e suporte a Safe Areas.
 * - Multilingue: Detecção automática via Pathname (PT, EN, ES).
 * - Framework: Otimizado para Next.js 16 e React 19.
 */

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useMemo, 
  useCallback, 
  type ReactNode 
} from 'react'
import { Moon, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme as useNextTheme } from 'next-themes'

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

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

/* -------------------------------------------------------------------------- */
/* 2. THEME PROVIDER (Orquestrador)                                          */
/* -------------------------------------------------------------------------- */

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const value = useMemo(() => ({
    theme: (theme as ThemeType) || 'system',
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
/* 3. CUSTOM HOOK (Abstração)                                                 */
/* -------------------------------------------------------------------------- */

export function useTheme() {
  const context = useContext(ThemeContext)
  // Fallback para caso o dev esqueça o Provider
  if (!context) {
    const { theme, setTheme, resolvedTheme } = useNextTheme()
    return {
      theme: (theme as ThemeType) || 'system',
      isDark: resolvedTheme === 'dark',
      mounted: true,
      toggleTheme: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }
  }
  return context
}

/* -------------------------------------------------------------------------- */
/* 4. THEME TOGGLE COMPONENT (UI)                                            */
/* -------------------------------------------------------------------------- */

export function ThemeToggle() {
  const pathname = usePathname()
  const { toggleTheme, isDark, mounted } = useTheme()

  /* --- Lógica de Tradução Interna --- */
  const lang = useMemo(() => {
    if (!pathname) return 'pt'
    const segment = pathname.split('/')[1]
    return (segment === 'en' || segment === 'es' ? segment : 'pt') as 'pt' | 'en' | 'es'
  }, [pathname])

  const labels = {
    pt: { dark: 'Ativar modo escuro', light: 'Ativar modo claro' },
    en: { dark: 'Enable dark mode', light: 'Enable light mode' },
    es: { dark: 'Activar modo oscuro', light: 'Activar modo claro' },
  }

  /* --- Skeleton durante a Hidratação --- */
  if (!mounted) {
    return (
      <div 
        className="w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 border border-transparent animate-pulse" 
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
        relative p-2.5 rounded-xl
        bg-white/80 dark:bg-slate-900/80
        border border-slate-200 dark:border-slate-800/60
        shadow-sm backdrop-blur-md
        text-slate-600 dark:text-slate-400
        hover:text-blue-600 dark:hover:text-amber-400
        hover:border-blue-500/30 dark:hover:border-amber-500/30
        transition-all duration-300
        group active:scale-95
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
      "
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {/* Ícone de Sol: Aparece quando está Dark */}
        <Sun
          size={20}
          className={`
            absolute transition-all duration-500 
            ${isDark 
              ? 'translate-y-0 opacity-100 rotate-0' 
              : 'translate-y-8 opacity-0 rotate-45'}
          `}
        />
        
        {/* Ícone de Lua: Aparece quando está Light */}
        <Moon
          size={20}
          className={`
            absolute transition-all duration-500 
            ${!isDark 
              ? 'translate-y-0 opacity-100 rotate-0' 
              : '-translate-y-8 opacity-0 -rotate-45'}
          `}
        />
      </div>
    </button>
  )
}
