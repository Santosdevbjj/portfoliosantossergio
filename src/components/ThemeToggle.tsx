'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme' // Ajustado para sua lógica real
import { usePathname } from 'next/navigation'

/**
 * THEME TOGGLE (Acessibilidade Sênior)
 * Componente isolado para alternância de tema. 
 * Pode ser usado dentro da Navbar ou como botão flutuante.
 */
export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme() // Usando sua estrutura customizada
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()

  // Detecta o idioma para fornecer acessibilidade internacional
  const lang = pathname?.split('/')[1] || 'pt'

  const labels = {
    pt: { dark: 'Ativar modo escuro', light: 'Ativar modo claro' },
    en: { dark: 'Enable dark mode', light: 'Enable light mode' },
    es: { dark: 'Activar modo oscuro', light: 'Activar modo claro' }
  }

  const t = labels[lang as keyof typeof labels] || labels.pt

  // Evita erro de hidratação (Mismatch entre servidor e cliente)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Placeholder com dimensões exatas para evitar Cumulative Layout Shift (CLS)
    return <div className="w-10 h-10 p-2.5" aria-hidden="true" />
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2.5 sm:p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/60 shadow-lg backdrop-blur-md text-slate-600 dark:text-blue-400 hover:scale-110 active:scale-90 transition-all duration-300 flex items-center justify-center"
      aria-label={isDark ? t.light : t.dark}
      title={isDark ? t.light : t.dark}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun 
            size={20} 
            className="text-yellow-500 animate-in fade-in zoom-in duration-500" 
          />
        ) : (
          <Moon 
            size={20} 
            className="text-blue-600 animate-in fade-in zoom-in -rotate-12 duration-500" 
          />
        )}
      </div>
    </button>
  )
}
