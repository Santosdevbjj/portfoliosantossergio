'use client'

/**
 * LANGUAGE & THEME SWITCHER
 * -----------------------------------------------------------------------------
 * - Responsividade: Layout inline-flex auto-ajustável.
 * - Multilingue: PT, EN, ES com persistência via cookies.
 * - Fix: Resolvido erro de mapeamento de tipos 'readonly' da Vercel.
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
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  function writeLocaleCookie(locale: string) {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=${LOCALE_COOKIE_OPTIONS.path}; max-age=${LOCALE_COOKIE_OPTIONS.maxAge}; SameSite=${LOCALE_COOKIE_OPTIONS.sameSite}`
  }

  // Labels dinâmicos baseados no dicionário de idiomas suportados
  const accessibilityLabels = {
    pt: { dark: 'Ativar modo escuro', light: 'Ativar modo claro', config: 'Configurações' },
    en: { dark: 'Toggle dark mode', light: 'Toggle light mode', config: 'Settings' },
    es: { dark: 'Activar modo oscuro', light: 'Activar modo claro', config: 'Configuración' }
  }[currentLang] || { dark: 'Dark mode', light: 'Light mode', config: 'Settings' }

  if (!mounted) {
    return (
      <div className="h-10 w-40 bg-slate-200/20 dark:bg-slate-800/20 animate-pulse rounded-2xl" />
    )
  }

  // SOLUÇÃO DO ERRO VERCEL: Convertendo explicitamente para um array mutável de Locales
  const availableLocales = Array.from(i18n.locales) as Locale[]

  return (
    <nav
      aria-label={accessibilityLabels.config}
      className="inline-flex items-center gap-1 p-1 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-xl"
    >
      {/* TOGGLE TEMA */}
      <button
        onClick={toggleTheme}
        type="button"
        title={isDark ? accessibilityLabels.light : accessibilityLabels.dark}
        aria-label={isDark ? accessibilityLabels.light : accessibilityLabels.dark}
        className="group w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all"
      >
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-45 transition-transform" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-blue-600 group-hover:-rotate-12 transition-transform" />
        )}
      </button>

      <div className="w-px h-4 bg-slate-300/50 dark:bg-slate-700/50 mx-0.5" aria-hidden="true" />

      {/* SELETOR DE IDIOMA */}
      <div className="flex items-center gap-0.5">
        {availableLocales.map((locale) => {
          const isActive = currentLang === locale
          const meta = localeMetadata[locale]

          // Lógica de URL para troca de idioma
          const segments = pathname?.split('/') || []
          const newSegments = [...segments]
          
          if (i18n.locales.includes(segments[1] as Locale)) {
            newSegments[1] = locale
          } else {
            newSegments.splice(1, 0, locale)
          }
          
          const queryString = searchParams?.toString()
          const finalPath = `${newSegments.join('/') || '/'}${queryString ? `?${queryString}` : ''}`

          return (
            <Link
              key={locale}
              href={finalPath as Route}
              hrefLang={locale}
              rel="alternate"
              prefetch={false}
              onClick={() => writeLocaleCookie(locale)}
              className={`
                relative px-2.5 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-xl transition-all duration-300
                ${isActive 
                  ? 'text-white' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
                }
              `}
            >
              <span className="relative z-10">{meta.label}</span>
              {isActive && (
                <span 
                  className="absolute inset-0 bg-blue-600 rounded-xl z-0 shadow-md shadow-blue-500/20" 
                  aria-hidden="true" 
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  return (
    <Suspense fallback={
      <div className="h-10 w-44 bg-slate-200/10 dark:bg-slate-800/10 rounded-2xl animate-pulse" />
    }>
      <LanguageSwitcherContent currentLang={currentLang} />
    </Suspense>
  )
}
