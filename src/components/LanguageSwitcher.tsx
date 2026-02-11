'use client'

/**
 * LANGUAGE SWITCHER — SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * Next.js 16 | TypeScript 5.9 | i18n consistente
 * Responsivo, acessível e alinhado aos dicionários.
 */

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import { i18n } from '@/i18n-config'
import type { Locale } from '@/types/dictionary'
import { LOCALE_COOKIE, LOCALE_COOKIE_OPTIONS } from '@/lib/locale-cookie'

// Labels curtos para UI
const languageLabels: Record<Locale, string> = {
  'pt-BR': 'PT',
  'en-US': 'EN',
  'es-ES': 'ES',
  'es-AR': 'AR',
  'es-MX': 'MX',
}

interface LanguageSwitcherProps {
  readonly currentLang: Locale
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
      <div className="h-9 w-40 sm:w-48 rounded-xl bg-slate-200/20 dark:bg-slate-800/20 animate-pulse" />
    )
  }

  function writeLocaleCookie(locale: Locale) {
    document.cookie =
      `${LOCALE_COOKIE}=${locale}; ` +
      `path=${LOCALE_COOKIE_OPTIONS.path}; ` +
      `max-age=${LOCALE_COOKIE_OPTIONS.maxAge}; ` +
      `SameSite=${LOCALE_COOKIE_OPTIONS.sameSite}` +
      `${location.protocol === 'https:' ? '; Secure' : ''}`
  }

  const availableLocales = i18n.locales as readonly Locale[]

  return (
    <nav
      aria-label="Select language"
      className="inline-flex items-center gap-1 p-1 rounded-xl border
                 border-slate-200/50 dark:border-slate-800/50
                 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm"
    >
      {availableLocales.map((locale) => {
        const isActive = currentLang === locale

        const segments = pathname?.split('/').filter(Boolean) ?? []

        if (segments[0] && availableLocales.includes(segments[0] as Locale)) {
          segments[0] = locale
        } else {
          segments.unshift(locale)
        }

        const path = `/${segments.join('/')}`
        const query = searchParams?.toString()
        const href = query ? `${path}?${query}` : path

        return (
          <Link
            key={locale}
            href={href}
            hrefLang={locale}
            onClick={() => writeLocaleCookie(locale)}
            className={`
              px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase
              transition-all duration-300
              ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600
                     dark:hover:text-blue-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
              }
            `}
          >
            {languageLabels[locale]}
          </Link>
        )
      })}
    </nav>
  )
}

export function LanguageSwitcher(props: LanguageSwitcherProps) {
  return (
    <Suspense
      fallback={
        <div className="h-9 w-40 sm:w-48 rounded-xl bg-slate-200/20 dark:bg-slate-800/20 animate-pulse" />
      }
    >
      <LanguageSwitcherContent {...props} />
    </Suspense>
  )
}
