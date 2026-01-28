'use client'

/**
 * LANGUAGE & THEME SWITCHER
 * -----------------------------------------------------------------------------
 * - UI: Floating Control Panel com Glassmorphism.
 * - UX: Persistência de idioma via Cookie e tema via LocalStorage.
 * - Alinhamento: Sincronizado com src/dictionaries/index.ts.
 */

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { i18n, type Locale, localeMetadata } from '@/i18n-config'
import { LOCALE_COOKIE, LOCALE_COOKIE_OPTIONS } from '@/lib/locale-cookie'
import type { SupportedLocale } from '@/dictionaries'

/* -------------------------------------------------------------------------- */
/* INTERNAL CONTENT */
/* -------------------------------------------------------------------------- */

function LanguageSwitcherContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  /* ----------------------------- Locale Logic ---------------------------- */
  const pathLocale = pathname?.split('/')[1] as SupportedLocale | undefined
  const currentLang: SupportedLocale = i18n.locales.includes(pathLocale as Locale)
    ? (pathLocale as SupportedLocale)
    : (i18n.defaultLocale as SupportedLocale)

  /* ------------------------------ Helpers -------------------------------- */
  function writeLocaleCookie(locale: string) {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=${LOCALE_COOKIE_OPTIONS.path}; max-age=${LOCALE_COOKIE_OPTIONS.maxAge}; SameSite=${LOCALE_COOKIE_OPTIONS.sameSite}`
  }

  function getNewPath(locale: string): string {
    if (!pathname) return `/${locale}`
    const segments = pathname.split('/')
    const hasLocale = i18n.locales.includes(segments[1] as Locale)
    const newSegments = [...segments]
    if (hasLocale) newSegments[1] = locale
    else newSegments.splice(1, 0, locale)
    const params = searchParams?.toString()
    const finalPath = newSegments.join('/') || '/'
    return `${finalPath}${params ? `?${params}` : ''}`
  }

  /* ----------------------------- Labels ---------------------------------- */
  const accessibilityLabels = {
    pt: {
      config: 'Configurações de idioma e tema',
      dark: 'Ativar modo escuro',
      light: 'Ativar modo claro',
    },
    en: {
      config: 'Language and theme settings',
      dark: 'Enable dark mode',
      light: 'Enable light mode',
    },
    es: {
      config: 'Configuración de idioma y tema',
      dark: 'Activar modo oscuro',
      light: 'Activar modo claro',
    },
  }[currentLang]

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 h-[52px] w-[160px] sm:w-[180px] bg-slate-200/20 dark:bg-slate-800/20 animate-pulse rounded-2xl backdrop-blur-md z-[110]"
      />
    )
  }

  return (
    <nav
      aria-label={accessibilityLabels.config}
      className="
        fixed top-4 right-4 sm:top-6 sm:right-6
        z-[110]
        flex items-center gap-1 p-1.5
        bg-white/80 dark:bg-slate-950/80
        backdrop-blur-2xl
        rounded-2xl
        border border-slate-200/50 dark:border-slate-800/50
        shadow-[0_20px_50px_rgba(0,0,0,0.1)]
        transition-all duration-300
        hover:shadow-[0_20px_50px_rgba(37,99,235,0.15)]
      "
    >
      {/* THEME TOGGLE */}
      <button
        onClick={toggleTheme}
        aria-label={isDark ? accessibilityLabels.light : accessibilityLabels.dark}
        className="
          group flex items-center justify-center
          w-10 h-10 sm:w-11 sm:h-11
          rounded-xl
          text-slate-600 dark:text-blue-400
          hover:bg-slate-100 dark:hover:bg-slate-800/50
          transition-all duration-300
          active:scale-90
        "
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-500 transition-transform group-hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-blue-600 transition-transform group-hover:-rotate-12" />
        )}
      </button>

      {/* DIVIDER */}
      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" aria-hidden="true" />

      {/* LANGUAGE SWITCHER */}
      <div className="flex items-center gap-1">
        <div className="hidden md:flex items-center px-2 text-slate-400 dark:text-slate-600">
          <Globe size={14} strokeWidth={2} />
        </div>

        {(i18n.locales as string[]).map((locale) => {
          const isActive = currentLang === locale
          const meta = localeMetadata[locale as Locale]

          return (
            <Link
              key={locale}
              href={getNewPath(locale)}
              hrefLang={locale}
              rel="alternate"
              prefetch={false}
              onClick={() => writeLocaleCookie(locale)}
              aria-label={meta.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              className={`
                relative px-2.5 py-2
                min-w-[36px] sm:min-w-[44px]
                text-[10px] sm:text-[11px]
                font-black uppercase tracking-widest
                rounded-xl
                flex items-center justify-center
                transition-all duration-500
                ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }
              `}
            >
              <span className="relative z-10">{meta.label}</span>
              {isActive && (
                <span
                  className="
                    absolute inset-0
                    bg-blue-600
                    rounded-xl
                    z-0
                    shadow-lg shadow-blue-600/40
                    animate-in fade-in zoom-in-90 duration-300
                  "
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

/* -------------------------------------------------------------------------- */
/* EXPORT (Suspense Wrapper) */
/* -------------------------------------------------------------------------- */

export function LanguageSwitcher() {
  return (
    <Suspense
      fallback={
        <div
          aria-hidden="true"
          className="fixed top-4 right-4 sm:top-6 sm:right-6 h-[52px] w-[160px] sm:w-[180px] bg-slate-200/10 dark:bg-slate-800/10 rounded-2xl animate-pulse"
        />
      }
    >
      <LanguageSwitcherContent />
    </Suspense>
  )
}
