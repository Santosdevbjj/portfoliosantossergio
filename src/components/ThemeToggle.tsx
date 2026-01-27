'use client'

/**
 * THEME TOGGLE: Alternador de Tema com Consciência de Idioma
 * -----------------------------------------------------------------------------
 * - UX: Feedback visual imediato com micro-interações.
 * - A11y: Rótulos dinâmicos (ARIALabels) em PT, EN e ES.
 * - Performance: Prevenção de Flash of Unstyled Content (FOUC) via Skeleton.
 */

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const pathname = usePathname()
  const { theme, toggleTheme, mounted } = useTheme()

  /* ------------------------------ i18n Logic ------------------------------ */
  // Detecta o idioma para garantir que a acessibilidade seja multilíngue
  const lang = React.useMemo(() => {
    const segment = pathname?.split('/')?.[1]
    return (segment === 'en' || segment === 'es' ? segment : 'pt') as 'pt' | 'en' | 'es'
  }, [pathname])

  const labels = {
    pt: { dark: 'Ativar modo escuro', light: 'Ativar modo claro' },
    en: { dark: 'Enable dark mode', light: 'Enable light mode' },
    es: { dark: 'Activar modo oscuro', light: 'Activar modo claro' },
  }

  /* --------------------------- Skeleton State ----------------------------- */
  // Evita que o botão "pule" ou mude de ícone durante a hidratação
  if (!mounted) {
    return (
      <div 
        className="w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse border border-transparent" 
        aria-hidden="true"
      />
    )
  }

  const isDark = theme === 'dark'
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
        group active:scale-90
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
      "
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {/* Ícone de Sol: Aparece no Dark Mode para voltar ao Light */}
        <Sun
          size={20}
          className={`
            absolute transition-all duration-500 ease-spring
            ${isDark 
              ? 'translate-y-0 opacity-100 rotate-0' 
              : 'translate-y-8 opacity-0 rotate-45'}
          `}
        />
        
        {/* Ícone de Lua: Aparece no Light Mode para ir ao Dark */}
        <Moon
          size={20}
          className={`
            absolute transition-all duration-500 ease-spring
            ${!isDark 
              ? 'translate-y-0 opacity-100 rotate-0' 
              : '-translate-y-8 opacity-0 -rotate-45'}
          `}
        />
      </div>

      {/* Efeito de Ring sutil no hover */}
      <span className="absolute inset-0 rounded-xl border border-blue-500/0 group-hover:border-blue-500/10 dark:group-hover:border-amber-500/10 transition-colors" />
    </button>
  )
}
