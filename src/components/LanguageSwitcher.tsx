'use client'

/**
 * LANGUAGE SWITCHER — SÉRGIO SANTOS (REVISÃO 2026)
 * -----------------------------------------------------------------------------
 * - Responsividade: Design compacto para Header/Navbar.
 * - Multilingue: Suporte a PT, EN, ES com preservação de rota e âncoras.
 * - Performance: Utiliza Suspense para evitar bloqueio de renderização no Next.js 16.
 */

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import type { Route } from 'next'

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
      <div className="h-8 w-32 bg-slate-200/10 dark:bg-slate-800/10 animate-pulse rounded-lg" />
    )
  }

  /**
   * Grava a preferência do usuário no Cookie para que o Middleware 
   * redirecione corretamente em visitas futuras.
   */
  function writeLocaleCookie(locale: string) {
    if (typeof document === 'undefined') return
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=${LOCALE_COOKIE_OPTIONS.path}; max-age=${LOCALE_COOKIE_OPTIONS.maxAge}; SameSite=${LOCALE_COOKIE_OPTIONS.sameSite}`
  }

  const labels = {
    pt: 'Mudar idioma',
    en: 'Change language',
    es: 'Cambiar idioma'
  }[currentLang] || 'Change language'

  const availableLocales = Array.from(i18n.locales) as Locale[]

  return (
    <nav aria-label={labels} className="inline-flex items-center gap-1 p-1 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-lg border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
      {availableLocales.map((locale) => {
        const isActive = currentLang === locale
        const meta = localeMetadata[locale]

        // Lógica de Reconstrução da Rota (Preserva sub-páginas e IDs)
        const segments = pathname?.split('/') || []
        if (segments[1] && availableLocales.includes(segments[1] as Locale)) {
          segments[1] = locale
        } else {
          // Caso a rota não comece com o locale (fallback)
          segments.splice(1, 0, locale)
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
              relative px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter rounded-md transition-all
              ${isActive 
                ? 'text-white bg-blue-600 shadow-md' 
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
    <Suspense fallback={<div className="h-8 w-32 bg-slate-200/10 rounded-lg animate-pulse" />}>
      <LanguageSwitcherContent currentLang={currentLang} />
    </Suspense>
  )
}
