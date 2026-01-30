'use client'

/**
 * THEME TOGGLE — SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * - Responsividade: Adaptativo com feedback tátil (active:scale-95).
 * - Multilingue: Labels em PT, EN, ES baseados na rota atual.
 * - Build Fix: Removida variável 'theme' não utilizada para sanar erro de compilação.
 */

import { useState, useEffect, useMemo } from 'react'
import { Moon, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const pathname = usePathname()
  // Removido 'theme' para evitar erro "declared but never read" no Vercel
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Garante sincronia após montagem no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  /* ------------------------------ i18n Logic ------------------------------ */
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

  /* --------------------------- Skeleton State ----------------------------- */
  if (!mounted) {
    return (
      <div 
        className="w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 border border-transparent animate-pulse" 
        aria-hidden="true"
      />
    )
  }

  const isDark = resolvedTheme === 'dark'
  const t = labels[lang]
  const currentLabel = isDark ? t.light : t.dark

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
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
        {/* Ícone de Sol: Visível no Dark Mode para mudar para Light */}
        <Sun
          size={20}
          className={`
            absolute transition-all duration-500 
            ${isDark 
              ? 'translate-y-0 opacity-100 rotate-0' 
              : 'translate-y-8 opacity-0 rotate-45'}
          `}
        />
        
        {/* Ícone de Lua: Visível no Light Mode para mudar para Dark */}
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

      {/* Overlay decorativo discreto */}
      <span className="absolute inset-0 rounded-xl border border-blue-500/0 group-hover:border-blue-500/10 dark:group-hover:border-amber-500/10 transition-colors pointer-events-none" />
    </button>
  )
}
