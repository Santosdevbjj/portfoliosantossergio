'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react' // Removido 'Monitor' para evitar erro de build
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import type { CommonDictionary } from '@/types/dictionary'

/* -------------------------------------------------------------------------- */
/* THEME PROVIDER                                                            */
/* -------------------------------------------------------------------------- */

export function ThemeProvider({ children }: { readonly children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}

/* -------------------------------------------------------------------------- */
/* THEME TOGGLE                                                               */
/* -------------------------------------------------------------------------- */

interface ThemeToggleProps {
  readonly labels: CommonDictionary['theme']
}

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Evita erro de hidratação no Next.js 16/Turbo
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-11 h-11 rounded-xl bg-slate-200/20 dark:bg-slate-800/20 animate-pulse" />
    )
  }

  // Lógica de ciclo simplificada: Light -> Dark -> System
  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme || 'system')
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  // Define qual label usar com base no tema atual
  const currentLabel = labels[theme as keyof typeof labels] || labels.system

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={currentLabel}
      title={currentLabel}
      className="group relative w-11 h-11 flex items-center justify-center rounded-xl 
                 bg-white/80 dark:bg-slate-900/80 border border-slate-200 
                 dark:border-slate-800/60 backdrop-blur-md hover:scale-105 active:scale-95 
                 transition-all duration-300 shadow-sm"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {resolvedTheme === 'dark' ? (
          <Moon 
            className="text-amber-400 transition-transform duration-500 rotate-0" 
            size={20} 
          />
        ) : (
          <Sun 
            className="text-amber-600 transition-transform duration-500 rotate-0" 
            size={20} 
          />
        )}
      </div>
    </button>
  )
}
