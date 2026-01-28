'use client'

/**
 * LANGUAGE & THEME SWITCHER
 * -----------------------------------------------------------------------------
 * - Responsividade: Layout compacto com glassmorphism.
 * - Multilingue: Suporte nativo para PT, EN, ES.
 * - Persistência: Gerenciamento de cookies para localidade e hook de tema.
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

function LanguageSwitcherContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Detecta o idioma atual pela URL ou fallback para o padrão
  const pathLocale = pathname?.split('/')[1] as SupportedLocale | undefined
  const currentLang: SupportedLocale = i18n.locales.includes(pathLocale as Locale)
    ? (pathLocale as SupportedLocale)
    : (i18n.defaultLocale as SupportedLocale)

  function writeLocaleCookie(locale: string) {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=${LOCALE_COOKIE_OPTIONS.path}; max-age=${LOCALE_COOKIE_OPTIONS.maxAge}; SameSite=${LOCALE_COOKIE_OPTIONS.sameSite}`
  }

  // Labels de acessibilidade adaptadas ao idioma atual
  const accessibilityLabels = {
    pt: { dark: 'Ativar modo escuro', light: 'Ativar modo claro', config: 'Configurações de idioma e tema' },
    en: { dark: 'Toggle dark mode', light: 'Toggle light mode', config: 'Language and theme settings' },
    es: { dark: 'Activar modo oscuro', light: 'Activar modo claro', config: 'Configuración de idioma y tema' }
  }[currentLang]

  if (!mounted) {
    return <div className="h-[52px] w-[160px] bg-slate-200/20 dark:bg-slate-800/20 animate-pulse rounded-2xl" />
  }

  return (
    <nav
      aria-label={accessibilityLabels.config}
      className="flex items-center gap-1 p-1.5 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-2xl transition-all duration-300"
    >
      {/* TOGGLE TEMA */}
      <button
        onClick={toggleTheme}
        type="button"
        title={isDark ? accessibilityLabels.light : accessibilityLabels.dark}
        aria-label={isDark ? accessibilityLabels.light : accessibilityLabels.dark}
        className="group w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform" />
        ) : (
          <Moon className="w-4 h-4 text-blue-600 group-hover:-rotate-12 transition-transform" />
        )}
      </button>

      <div className="w-px h-6 bg-slate-300/50 dark:bg-slate-700/50 mx-1" aria-hidden="true" />

      {/* SELETOR DE IDIOMA */}
      <div className="flex items-center gap-1">
        {(i18n.locales as Locale[]).map((locale) => {
          const isActive = currentLang === locale
          const meta = localeMetadata[locale]

          // Reconstrói a URL para o novo idioma mantendo parâmetros de busca (searchParams)
          const segments = pathname?.split('/') || []
          const newSegments = [...segments]
          
          // Se o primeiro segmento após a barra for um locale conhecido, substitui. Caso contrário, insere.
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
                relative px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-500
                ${isActive 
                  ? 'text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
                }
              `}
            >
              <span className="relative z-10">{meta.label}</span>
              {isActive && (
                <span 
                  className="absolute inset-0 bg-blue-600 rounded-xl z-0" 
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

export function LanguageSwitcher() {
  return (
    <Suspense fallback={
      <div className="h-[52px] w-[180px] bg-slate-200/10 dark:bg-slate-800/10 rounded-2xl animate-pulse border border-transparent" />
    }>
      <LanguageSwitcherContent />
    </Suspense>
  )
}
