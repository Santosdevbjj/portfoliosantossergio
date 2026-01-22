'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { usePathname } from 'next/navigation'

/**
 * THEME TOGGLE (Acessibilidade Sênior)
 * Componente isolado para alternância de tema com suporte multilingue via roteamento.
 */
export function ThemeToggle() {
  const { isDark, toggleTheme, mounted } = useTheme()
  const pathname = usePathname()

  // Extração robusta do idioma: procura o primeiro segmento após a barra
  const langMatch = pathname?.match(/^\/([a-z]{2})/)
  const lang = (langMatch ? langMatch[1] : 'pt') as 'pt' | 'en' | 'es'

  const labels = {
    pt: { dark: 'Ativar modo escuro', light: 'Ativar modo claro' },
    en: { dark: 'Enable dark mode', light: 'Enable light mode' },
    es: { dark: 'Activar modo oscuro', light: 'Activar modo claro' }
  }

  const t = labels[lang] || labels.pt

  // Placeholder estável para evitar CLS (Cumulative Layout Shift)
  if (!mounted) {
    return (
      <div 
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 animate-pulse" 
        aria-hidden="true" 
      />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 shadow-xl backdrop-blur-md text-slate-600 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-500/30 transition-all duration-300 flex items-center justify-center group active:scale-90"
      aria-label={isDark ? t.light : t.dark}
      title={isDark ? t.light : t.dark}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun 
            size={20} 
            className="text-amber-500 transform transition-all duration-500 rotate-0 scale-100 group-hover:rotate-90 animate-in zoom-in-50" 
          />
        ) : (
          <Moon 
            size={20} 
            className="text-blue-600 transform transition-all duration-500 -rotate-12 scale-100 group-hover:rotate-0 animate-in zoom-in-50" 
          />
        )}
      </div>
    </button>
  )
}
