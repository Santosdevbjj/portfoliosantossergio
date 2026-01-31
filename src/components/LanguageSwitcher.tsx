'use client'

/**
 * LANGUAGE SWITCHER — SÉRGIO SANTOS (CORRIGIDO PARA BUILD)
 * -----------------------------------------------------------------------------
 */

import { useState, useEffect, Suspense, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import { i18n, type Locale, localeMetadata } from '@/i18n-config'
import { LOCALE_COOKIE, LOCALE_COOKIE_OPTIONS } from '@/lib/locale-cookie'
import type { SupportedLocale } from '@/dictionaries'

interface LanguageSwitcherProps {
  readonly currentLang: SupportedLocale
}

function LanguageSwitcherContent({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-8 w-28 rounded-lg bg-slate-200/10 dark:bg-slate-800/10 animate-pulse" />
    )
  }

  function writeLocaleCookie(locale: SupportedLocale) {
    if (typeof document === 'undefined') return
    document.cookie =
      `${LOCALE_COOKIE}=${locale}; ` +
      `path=${LOCALE_COOKIE_OPTIONS.path}; ` +
      `max-age=${LOCALE_COOKIE_OPTIONS.maxAge}; ` +
      `SameSite=${LOCALE_COOKIE_OPTIONS.sameSite}` +
      `${location.protocol === 'https:' ? '; Secure' : ''}`
  }

  const availableLocales = Array.from(i18n.locales) as Locale[]

  return (
    <nav
      aria-label="Language selector"
      className="inline-flex items-center gap-1 p-1 rounded-lg border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm"
    >
      {availableLocales.map((locale) => {
        const isActive = currentLang === locale
        const meta = localeMetadata[locale]

        // Lógica de reconstrução de rota blindada
        const segments = pathname ? pathname.split('/') : []
        
        // Se o segundo segmento for um idioma conhecido, substitui. Se não, insere.
        if (segments[1] && availableLocales.includes(segments[1] as Locale)) {
          segments[1] = locale
        } else {
          segments.splice(1, 0, locale)
        }

        const queryString = searchParams?.toString()
        // Garantimos que finalPath comece com / e tratamos como string pura para o Link
        const path = segments.join('/') || '/'
        const finalPath = queryString ? `${path}?${queryString}` : path

        return (
          <Link
            key={locale}
            // O segredo está em garantir que o href nunca seja undefined
            href={finalPath as any} 
            hrefLang={locale}
            onClick={() => writeLocaleCookie(locale)}
            className={`
              relative px-2.5 py-1 rounded-md
              text-[10px] font-black uppercase tracking-tighter
              transition-all duration-200
              ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
              }
            `}
          >
            {meta.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  return (
    <Suspense
      fallback={
        <div className="h-8 w-28 rounded-lg bg-slate-200/10 dark:bg-slate-800/10 animate-pulse" />
      }
    >
      <LanguageSwitcherContent currentLang={currentLang} />
    </Suspense>
  )
}
