'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
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

  // Evita erro de hidratação no Next.js 16
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-11 h-11 rounded-xl bg-slate-200/20 animate-pulse" />
  }

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme || 'system')
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  return (
    <button
      onClick={cycleTheme}
      aria-label={labels[theme as keyof typeof labels] || labels.system}
      className="group relative w-11 h-11 flex items-center justify-center rounded-xl 
                 bg-white/80 dark:bg-slate-900/80 border border-slate-200 
                 dark:border-slate-800 backdrop-blur-md hover:scale-105 active:scale-95 
                 transition-all duration-300"
    >
      {resolvedTheme === 'dark' ? (
        <Moon className="text-amber-400" size={20} />
      ) : (
        <Sun className="text-amber-600" size={20} />
      )}
    </button>
  )
}
