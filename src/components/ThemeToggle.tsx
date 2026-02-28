'use client'

import * as React from 'react'
import { Moon, Sun, Monitor, Zap } from 'lucide-react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import type { CommonDictionary } from '@/types/dictionary'

/* THEME PROVIDER */
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

/* THEME TOGGLE */
interface ThemeToggleProps {
  readonly labels: CommonDictionary['theme']
}

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return <div className="w-11 h-11 rounded-xl bg-slate-200/20 animate-pulse" />
  }

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'neon', 'system'] as const
    const currentTheme = (theme as typeof themes[number]) || 'system'
    const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length
    setTheme(themes[nextIndex] ?? 'system')
  }

  const themeKey = (theme as keyof typeof labels) || 'system'
  const currentLabel = labels[themeKey] || labels.system

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={currentLabel}
      title={currentLabel}
      className="group relative w-11 h-11 flex items-center justify-center rounded-xl
      bg-white/80 dark:bg-slate-900/80 border border-slate-200
      dark:border-slate-800/60 backdrop-blur-md hover:scale-105 active:scale-95
      transition-all duration-300 shadow-sm ring-brand-500/50 hover:ring-2"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {resolvedTheme === 'dark' && (
          <Moon className="text-amber-400 transition-all duration-500 group-hover:rotate-12" size={20} />
        )}
        {resolvedTheme === 'light' && (
          <Sun className="text-amber-600 transition-all duration-500 group-hover:rotate-90" size={20} />
        )}
        {resolvedTheme === 'neon' && (
          <Zap className="text-cyan-400 transition-all duration-500 group-hover:scale-110" size={20} />
        )}
        {theme === 'system' && (
          <Monitor size={8} className="absolute -bottom-1 -right-1 text-slate-400 opacity-70" />
        )}
      </div>
    </button>
  )
}
