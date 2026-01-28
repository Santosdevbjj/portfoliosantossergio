'use client'

/**
 * LANGUAGE & THEME SWITCHER
 * -----------------------------------------------------------------------------
 * CORREÇÃO PARA VERCEL: 
 * O erro "readonly ['pt', 'en', 'es'] to type 'string[]'" é resolvido 
 * criando uma nova instância do array usando [...i18n.locales].
 */

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/hooks/useTheme'
import { i18n, type Locale, localeMetadata } from '@/i18n-config'
import { LOCALE_COOKIE, LOCALE_COOKIE_OPTIONS } from '@/lib/locale-cookie'
import type { SupportedLocale } from '@/dictionaries'

function LanguageSwitcherContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isDark, toggleTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Determina o idioma atual via URL
  const pathLocale = pathname?.split('/')[1] as SupportedLocale | undefined
  const currentLang: SupportedLocale = i18n.locales.includes(pathLocale as Locale)
    ? (pathLocale as SupportedLocale)
    : (i18n.defaultLocale as SupportedLocale)

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
    return `${newSegments.join('/') || '/'}${params ? `?${params}` : ''}`
  }

  // Labels locais para acessibilidade
  const accessibilityLabels = {
    pt: { config: 'Configurações', dark: 'Modo escuro', light: 'Modo claro' },
    en: { config: 'Settings', dark: 'Dark mode', light: 'Light mode' },
    es: { config: 'Configuración', dark: 'Modo oscuro', light: 'Modo claro' },
  }[currentLang] || { config: 'Settings', dark: 'Dark', light: 'Light' }

  if (!mounted) return <div className="h-[52px] w-[160px] bg-slate-200/20 dark:bg-slate-800/20 animate-pulse rounded-2xl" />

  return (
    <nav
      aria-label={accessibilityLabels.config}
      className="flex items-center gap-1 p-1.5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl"
    >
      <button
        onClick={toggleTheme}
        aria-label={isDark ? accessibilityLabels.light : accessibilityLabels.dark}
        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all"
      >
        {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-600" />}
      </button>

      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" aria-hidden="true" />

      <div className="flex items-center gap-1">
        {/* CORREÇÃO DO ERRO DE COMPILAÇÃO AQUI: [...i18n.locales] */}
        {[...i18n.locales].map((locale) => {
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
              className={`
                relative px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all
                ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}
              `}
            >
              <span className="relative z-10">{meta.label}</span>
              {isActive && (
                <span className="absolute inset-0 bg-blue-600 rounded-xl z-0 shadow-lg shadow-blue-600/40 animate-in fade-in zoom-in-90 duration-300" aria-hidden="true" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function LanguageSwitcher() {
  return (
    <Suspense fallback={<div className="h-[52px] w-[160px] bg-slate-200/10 dark:bg-slate-800/10 rounded-2xl animate-pulse" />}>
      <LanguageSwitcherContent />
    </Suspense>
  )
}
