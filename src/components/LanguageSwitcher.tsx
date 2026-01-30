'use client'

/**
 * LANGUAGE & THEME SWITCHER — SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * - Responsividade: Adaptativo para Mobile/Desktop.
 * - I18n: Suporte nativo a PT, EN, ES.
 * - UX: Persistência de estado e transições suaves.
 */

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Moon, Sun } from 'lucide-react'
import type { Route } from 'next'

import { useTheme } from '@/hooks/useTheme'
import { i18n, type Locale, localeMetadata } from '@/i18n-config'
import { LOCALE_COOKIE, LOCALE_COOKIE_OPTIONS } from '@/lib/locale-cookie'
import type { SupportedLocale } from '@/dictionaries'

interface LanguageSwitcherProps {
  readonly currentLang: SupportedLocale
}

function LanguageSwitcherContent({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isDark, toggleTheme, mounted } = useTheme()

  function writeLocaleCookie(locale: string) {
    if (typeof document === 'undefined') return
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=${LOCALE_COOKIE_OPTIONS.path}; max-age=${LOCALE_COOKIE_OPTIONS.maxAge}; SameSite=${LOCALE_COOKIE_OPTIONS.sameSite}`
  }

  // Rótulos de acessibilidade dinâmicos
  const labels = {
    pt: { dark: 'Ativar modo escuro', light: 'Ativar modo claro', lang: 'Mudar idioma' },
    en: { dark: 'Toggle dark mode', light: 'Toggle light mode', lang: 'Change language' },
    es: { dark: 'Activar modo oscuro', light: 'Activar modo claro', lang: 'Cambiar idioma' }
  }[currentLang]

  if (!mounted) {
    return (
      <div className="h-9 w-44 bg-slate-200/10 dark:bg-slate-800/10 animate-pulse rounded-xl" />
    )
  }

  const availableLocales = Array.from(i18n.locales) as Locale[]

  return (
    <div className="inline-flex items-center gap-1.5 p-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      
      {/* ALTERNADOR DE TEMA */}
      <button
        onClick={toggleTheme}
        type="button"
        title={isDark ? labels.light : labels.dark}
        aria-label={isDark ? labels.light : labels.dark}
        className="group w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all active:scale-90"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-500 transition-transform group-hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-blue-600 transition-transform group-hover:-rotate-12" />
        )}
      </button>

      <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-0.5" aria-hidden="true" />

      {/* SELETOR DE IDIOMA */}
      <nav aria-label={labels.lang} className="flex items-center gap-1">
        {availableLocales.map((locale) => {
          const isActive = currentLang === locale
          const meta = localeMetadata[locale]

          // Preservação de Rota e Query Params
          const segments = pathname?.split('/') || []
          if (segments[1] && availableLocales.includes(segments[1] as Locale)) {
            segments[1] = locale
          }
          const queryString = searchParams?.toString()
          const finalPath = `${segments.join('/') || '/'}${queryString ? `?${queryString}` : ''}`

          return (
            <Link
              key={locale}
              href={finalPath as Route}
              hrefLang={locale}
              onClick={() => writeLocaleCookie(locale)}
              className={`
                relative px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all
                ${isActive 
                  ? 'text-white bg-blue-600 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
                }
              `}
            >
              {meta.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  return (
    <Suspense fallback={<div className="h-9 w-44 bg-slate-200/10 rounded-xl" />}>
      <LanguageSwitcherContent currentLang={currentLang} />
    </Suspense>
  )
}
