'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { usePathname } from 'next/navigation'

/**
 * THEME TOGGLE (Acessibilidade Sênior)
 * Componente para alternância de tema com suporte multilingue para ARIA labels.
 */
export function ThemeToggle() {
  // O hook useTheme agora centraliza a lógica de 'isDark' e 'mounted'
  const { isDark, toggleTheme, mounted } = useTheme()
  const pathname = usePathname()

  // Extração segura do idioma da rota para acessibilidade internacional
  const lang = (pathname?.split('/')[1] || 'pt') as 'pt' | 'en' | 'es'

  const labels = {
    pt: { dark: 'Ativar modo escuro', light: 'Ativar modo claro' },
    en: { dark: 'Enable dark mode', light: 'Enable light mode' },
    es: { dark: 'Activar modo oscuro', light: 'Activar modo claro' }
  }

  // Fallback para português caso a rota não corresponda
  const t = labels[lang] || labels.pt

  // Renderiza um placeholder invisível com o mesmo tamanho para evitar CLS
  if (!mounted) {
    return (
      <div 
        className="w-[42px] h-[42px] p-2.5 border border-transparent" 
        aria-hidden="true" 
      />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2.5 sm:p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/60 shadow-lg backdrop-blur-md text-slate-600 dark:text-blue-400 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      aria-label={isDark ? t.light : t.dark}
      title={isDark ? t.light : t.dark}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {isDark ? (
          <Sun 
            size={20} 
            className="text-yellow-500 animate-in fade-in slide-in-from-bottom-2 duration-500" 
          />
        ) : (
          <Moon 
            size={20} 
            className="text-blue-600 animate-in fade-in slide-in-from-top-2 -rotate-12 duration-500" 
          />
        )}
      </div>
    </button>
  )
}
