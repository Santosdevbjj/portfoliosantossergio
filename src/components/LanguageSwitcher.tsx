'use client'

/**
 * LANGUAGE SWITCHER — SÉRGIO SANTOS (REVISÃO FINAL DE CONSISTÊNCIA)
 * -----------------------------------------------------------------------------
 * Alinhado com: es-AR, es-MX, es-ES, pt-BR e en-US.
 */

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import { i18n, type Locale, localeMetadata } from '@/i18n-config'
import { LOCALE_COOKIE, LOCALE_COOKIE_OPTIONS } from '@/lib/locale-cookie'

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

  // Skeleton loading para evitar Hydration Mismatch
  if (!mounted) {
    return (
      <div className="h-9 w-48 rounded-lg bg-slate-200/20 dark:bg-slate-800/20 animate-pulse" />
    )
  }

  /**
   * Atualiza o cookie de preferência do usuário para futuras visitas (Middleware)
   */
  function writeLocaleCookie(locale: Locale) {
    if (typeof document === 'undefined') return
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
      aria-label="Language selector"
      className="inline-flex items-center gap-1.5 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm"
    >
      {availableLocales.map((locale) => {
        const isActive = currentLang === locale
        
        // Fallback de segurança para o Label (busca no i18n-config)
        const meta = localeMetadata[locale] || { label: locale.toUpperCase() }

        // Lógica de URL robusta: limpa segmentos vazios e substitui o idioma
        const segments = pathname ? pathname.split('/').filter(Boolean) : []
        
        if (segments.length > 0 && availableLocales.includes(segments[0] as Locale)) {
          segments[0] = locale
        } else {
          segments.unshift(locale)
        }

        const path = `/${segments.join('/')}`
        const queryString = searchParams?.toString()
        const finalPath = queryString ? `${path}?${queryString}` : path

        return (
          <Link
            key={locale}
            href={finalPath as any} 
            hrefLang={locale}
            onClick={() => writeLocaleCookie(locale)}
            className={`
              relative px-2 py-1.5 rounded-lg
              text-[10px] font-bold uppercase tracking-tight
              transition-all duration-300 ease-out
              ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg scale-105 z-10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/60 dark:hover:bg-slate-800/60'
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
        <div className="h-9 w-48 rounded-lg bg-slate-200/20 dark:bg-slate-800/20 animate-pulse" />
      }
    >
      <LanguageSwitcherContent currentLang={currentLang} />
    </Suspense>
  )
}
