'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { usePathname } from 'next/navigation'

export function ThemeToggle() {
  const pathname = usePathname()
  const { theme, toggleTheme, mounted } = useTheme()

  const langMatch = pathname?.match(/^\/([a-z]{2})/)
  const lang = (langMatch ? langMatch[1] : 'pt') as 'pt' | 'en' | 'es'

  const labels = {
    pt: { dark: 'Ativar modo escuro', light: 'Ativar modo claro' },
    en: { dark: 'Enable dark mode', light: 'Enable light mode' },
    es: { dark: 'Activar modo oscuro', light: 'Activar modo claro' }
  }
  const t = labels[lang] || labels.pt

  if (!mounted) {
    return (
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100/50 animate-pulse" aria-hidden="true" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={theme === 'dark' ? t.light : t.dark}
      title={theme === 'dark' ? t.light : t.dark}
      className="
        p-2.5 rounded-xl
        bg-white/80 border border-slate-200/50
        shadow-xl backdrop-blur-md
        text-slate-600
        hover:bg-white hover:border-blue-500/30
        transition-all duration-300
        flex items-center justify-center
        group active:scale-90
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
      "
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
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
