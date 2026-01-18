'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'

/**
 * ThemeToggle - Componente de alta fidelidade para alternância de tema.
 * Totalmente responsivo e preparado para internacionalização (Acessibilidade).
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()

  // Detecta o idioma atual pela URL para traduzir o aria-label de acessibilidade
  const lang = pathname?.split('/')[1] || 'pt'

  const labels = {
    pt: { dark: 'Ativar modo escuro', light: 'Ativar modo claro' },
    en: { dark: 'Enable dark mode', light: 'Enable light mode' },
    es: { dark: 'Activar modo oscuro', light: 'Activar modo claro' }
  }

  const t = labels[lang as keyof typeof labels] || labels.pt

  // Essencial para evitar o erro de hidratação no Next.js App Router
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Retornamos um placeholder com o mesmo tamanho para evitar saltos no layout (CLS)
    return <div className="w-10 h-10" aria-hidden="true" />
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 sm:p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/60 shadow-lg backdrop-blur-md text-slate-600 dark:text-blue-400 hover:scale-105 active:scale-95 transition-all duration-300"
      aria-label={theme === 'dark' ? t.light : t.dark}
      title={theme === 'dark' ? t.light : t.dark}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun 
            size={20} 
            className="animate-in fade-in zoom-in spin-in-12 duration-500" 
          />
        ) : (
          <Moon 
            size={20} 
            className="animate-in fade-in zoom-in -rotate-12 duration-500" 
          />
        )}
      </div>
    </button>
  )
}
