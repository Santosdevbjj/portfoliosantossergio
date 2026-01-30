'use client'

/**
 * THEME TOGGLE: Alternador de Tema com Consciência de Idioma
 * -----------------------------------------------------------------------------
 * Revisão Sênior:
 * 1. Uso direto do 'next-themes' para evitar dessincronização.
 * 2. Lógica de i18n simplificada e resiliente.
 * 3. Animações otimizadas para evitar "jank" em dispositivos móveis.
 */

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes' // Recomendado usar diretamente do provider

export function ThemeToggle() {
  const pathname = usePathname()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // O componente só assume sua forma final após a montagem no cliente
  React.useEffect(() => {
    setMounted(true)
  }, [])

  /* ------------------------------ i18n Logic ------------------------------ */
  const lang = React.useMemo(() => {
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
        className="w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 border border-transparent" 
        aria-hidden="true"
      />
    )
  }

  // Usamos resolvedTheme para lidar com o tema 'system' corretamente
  const isDark = resolvedTheme === 'dark'
  const t = labels[lang]
  const currentLabel = isDark ? t.light : t.dark

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

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
        {/* Ícone de Sol: Visível quando o tema resolvido é escuro */}
        <Sun
          size={20}
          className={`
            absolute transition-all duration-500 
            ${isDark 
              ? 'translate-y-0 opacity-100 rotate-0' 
              : 'translate-y-8 opacity-0 rotate-45'}
          `}
        />
        
        {/* Ícone de Lua: Visível quando o tema resolvido é claro */}
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

      {/* Overlay de hover decorativo */}
      <span className="absolute inset-0 rounded-xl border border-blue-500/0 group-hover:border-blue-500/10 dark:group-hover:border-amber-500/10 transition-colors pointer-events-none" />
    </button>
  )
}
