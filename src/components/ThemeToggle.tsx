'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import type { CommonDictionary } from '@/types/dictionary'

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Labels derivadas diretamente do contrato do dicionário.
 * ✔ Zero duplicação
 * ✔ 100% alinhado com CommonDictionary
 * ✔ TS 6 safe
 */
export type ThemeToggleLabels = CommonDictionary['theme']

interface ThemeToggleProps {
  readonly labels: ThemeToggleLabels
}

/* -------------------------------------------------------------------------- */
/* THEME PROVIDER (GLOBAL WRAPPER)                                            */
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

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="w-11 h-11 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse"
      />
    )
  }

  const currentTheme = resolvedTheme ?? 'system'

  const nextTheme =
    currentTheme === 'light'
      ? 'dark'
      : currentTheme === 'dark'
      ? 'system'
      : 'light'

  const handleChange = React.useCallback(() => {
    setTheme(nextTheme)
  }, [nextTheme, setTheme])

  const ariaLabel =
    nextTheme === 'light'
      ? labels.light
      : nextTheme === 'dark'
      ? labels.dark
      : labels.system

  return (
    <button
      type="button"
      onClick={handleChange}
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
        {/* Light */}
        <Sun
          size={20}
          className={`absolute inset-0 transition-all duration-500 text-amber-500
            ${
              currentTheme === 'light'
                ? 'opacity-100 rotate-0'
                : 'opacity-0 -rotate-90'
            }`}
        />

        {/* Dark */}
        <Moon
          size={20}
          className={`absolute inset-0 transition-all duration-500 text-slate-600 dark:text-slate-400
            ${
              currentTheme === 'dark'
                ? 'opacity-100 rotate-0'
                : 'opacity-0 rotate-90'
            }`}
        />

        {/* System */}
        <Monitor
          size={20}
          className={`absolute inset-0 transition-all duration-500 text-blue-500
            ${
              currentTheme === 'system'
                ? 'opacity-100 rotate-0'
                : 'opacity-0 scale-75'
            }`}
        />
      </div>

      <span className="absolute inset-0 rounded-xl ring-0 ring-blue-500/20 group-hover:ring-4 transition-all duration-300" />
    </button>
  )
}
