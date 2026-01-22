'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'

/**
 * THEME TOGGLE AVANÇADO
 * Sincroniza com variável CSS `--theme` no :root, sem depender de classes dark.
 * Permite controle dinâmico e animações suaves.
 */
export function ThemeToggle() {
  const pathname = usePathname()

  // Extração do idioma robusta
  const langMatch = pathname?.match(/^\/([a-z]{2})/)
  const lang = (langMatch ? langMatch[1] : 'pt') as 'pt' | 'en' | 'es'

  const labels = {
    pt: { dark: 'Ativar modo escuro', light: 'Ativar modo claro' },
    en: { dark: 'Enable dark mode', light: 'Enable light mode' },
    es: { dark: 'Activar modo oscuro', light: 'Activar modo claro' }
  }
  const t = labels[lang] || labels.pt

  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      // Detecta tema salvo no localStorage ou preferências do sistema
      const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
      if (stored) return stored
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  // Sincroniza variável CSS --theme no :root
  React.useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Alterna tema
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={theme === 'dark' ? t.light : t.dark}
      title={theme === 'dark' ? t.light : t.dark}
      className="
        p-2.5 rounded-xl
        bg-white/80
        border border-slate-200/50
        shadow-xl backdrop-blur-md
        text-slate-600
        hover:bg-white
        hover:border-blue-500/30
        transition-all duration-300
        flex items-center justify-center
        group
        active:scale-90
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
      "
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun
            size={20}
            className="
              text-amber-500
              transform transition-all duration-500
              rotate-0 scale-100
              group-hover:rotate-90
              animate-in zoom-in-50
            "
          />
        ) : (
          <Moon
            size={20}
            className="
              text-blue-600
              transform transition-all duration-500
              -rotate-12 scale-100
              group-hover:rotate-0
              animate-in zoom-in-50
            "
          />
        )}
      </div>
    </button>
  )
}
