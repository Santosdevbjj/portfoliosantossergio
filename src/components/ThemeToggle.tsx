'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export interface ThemeToggleLabels {
  enableDark: string
  enableLight: string
}

interface ThemeToggleProps {
  labels: ThemeToggleLabels
}

/* -------------------------------------------------------------------------- */
/* THEME PROVIDER (GLOBAL)                                                     */
/* -------------------------------------------------------------------------- */

export function ThemeProvider({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="sergio-portfolio-theme"
    >
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </NextThemesProvider>
  )
}

/* -------------------------------------------------------------------------- */
/* THEME TOGGLE                                                               */
/* -------------------------------------------------------------------------- */

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = React.useCallback(() => {
    setTheme(isDark ? 'light' : 'dark')
  }, [isDark, setTheme])

  const ariaLabel = isDark ? labels.enableLight : labels.enableDark

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="w-11 h-11 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="group relative w-11 h-11 flex items-center justify-center rounded-xl
                 bg-white/80 dark:bg-slate-900/80
                 border border-slate-200 dark:border-slate-800/60
                 shadow-sm backdrop-blur-md
                 transition-all duration-300
                 hover:border-blue-500/50 dark:hover:border-amber-500/50
                 active:scale-95"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        <Sun
          size={20}
          className={`absolute inset-0 transform transition-all duration-500 text-amber-500
            ${isDark ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-8 opacity-0 -rotate-90'}`}
        />
        <Moon
          size={20}
          className={`absolute inset-0 transform transition-all duration-500 text-slate-600 dark:text-slate-400
            ${!isDark ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-8 opacity-0 rotate-90'}`}
        />
      </div>
      <span className="absolute inset-0 rounded-xl ring-0 ring-blue-500/20 group-hover:ring-4 transition-all duration-300" />
    </button>
  )
}
