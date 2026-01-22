'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'

/**
 * THEME TOGGLE AVANÇADO
 * Sincroniza com variável CSS `--theme` no :root, sem depender de classes dark.
 * Permite controle dinâmico, animações suaves e persistência em localStorage.
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

  // Estado do tema
  const [theme, setTheme] = React.useState<'light' | 'dark' | null>(null)

  // Montagem: define tema inicial sem causar CLS
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = stored || systemPref
    setTheme(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)
    document.documentElement.style.setProperty('--theme', initialTheme)
  }, [])

  // Sincroniza variável CSS e localStorage ao mudar tema
  React.useEffect(() => {
    if (!theme) return
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.setProperty('--theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Alterna tema
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))

  // Placeholder estável enquanto monta
  if (!theme) {
    return (
      <div
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100/50 animate-pulse dark:bg-slate-800/50"
        aria-hidden="true"
      />
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
