'use client'

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { i18n, type Locale, localeMetadata } from '@/i18n-config'

/**
 * COMPONENTE: LanguageSwitcherContent
 * Gerencia a troca de idiomas e temas com persistência de estado.
 */
const LanguageSwitcherContent = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isDark, toggleTheme } = useTheme()
  
  // Controle de hidratação
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Extração do idioma atual via URL
  const currentLang = (pathname?.split('/')[1] ?? i18n.defaultLocale) as Locale

  /**
   * Salva a preferência do usuário em um cookie para o Proxy ler posteriormente.
   */
  const handleLocaleChange = (lang: string) => {
    document.cookie = `NEXT_LOCALE=${lang};path=/;max-age=31536000;SameSite=Lax`
  }

  /**
   * RECONSTRUÇÃO DE ROTA
   * Garante que o usuário permaneça na mesma página ao trocar o idioma.
   */
  const getNewPath = (langCode: string): string => {
    if (!pathname) return `/${langCode}`
    
    const segments = pathname.split('/')
    const isLangSegment = i18n.locales.includes(segments[1] as Locale)
    
    const newSegments = [...segments]
    if (isLangSegment) {
      newSegments[1] = langCode
    } else {
      newSegments.splice(1, 0, langCode)
    }
    
    const newPathname = newSegments.join('/') || '/'
    const params = searchParams?.toString()
    return `${newPathname}${params ? `?${params}` : ''}`
  }

  // Skeleton estável durante hidratação
  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 sm:top-6 sm:right-8 h-10 w-36 bg-slate-200/20 dark:bg-slate-800/20 animate-pulse rounded-xl backdrop-blur-md z-[110]" />
    )
  }

  return (
    <nav 
      aria-label="Configurações de idioma e tema"
      className="fixed top-4 right-4 sm:top-6 sm:right-8 z-[110] flex items-center gap-1 p-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl transition-all duration-500 hover:bg-white/90 dark:hover:bg-slate-900/90"
    >
      {/* ALTERNADOR DE TEMA */}
      <button
        onClick={() => toggleTheme()}
        className="p-2 rounded-lg text-slate-600 dark:text-blue-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all active:scale-90 group"
        aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          {isDark ? (
            <Sun size={16} className="text-amber-500 animate-in zoom-in spin-in-90 duration-500" />
          ) : (
            <Moon size={16} className="text-blue-600 animate-in zoom-in spin-in-90 duration-500" />
          )}
        </div>
      </button>

      {/* Divisor */}
      <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" aria-hidden="true" />

      {/* SELETOR DE IDIOMAS */}
      <div className="flex items-center gap-0.5">
        <div className="hidden sm:flex items-center px-1 text-slate-400 dark:text-slate-600">
          <Globe size={13} strokeWidth={1.5} />
        </div>
        
        {i18n.locales.map((localeCode) => {
          const isActive = currentLang === localeCode
          const metadata = localeMetadata[localeCode]
          
          return (
            <Link
              key={localeCode}
              href={getNewPath(localeCode)}
              hrefLang={localeCode}
              rel="alternate"
              onClick={() => handleLocaleChange(localeCode)}
              className={`
                relative px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all duration-300 uppercase tracking-widest
                ${isActive 
                  ? 'text-white' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }
              `}
              aria-label={metadata.ariaLabel}
            >
              <span className="relative z-10">{metadata.label}</span>
              {isActive && (
                <div 
                  className="absolute inset-0 bg-blue-600 rounded-lg z-0 animate-in fade-in zoom-in-95 duration-500 shadow-lg shadow-blue-600/30" 
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

/**
 * EXPORT PRINCIPAL COM SUSPENSE
 * O Next.js 15 exige Suspense para componentes que consomem useSearchParams()
 */
export const LanguageSwitcher = () => (
  <Suspense fallback={
    <div className="fixed top-4 right-4 sm:top-6 sm:right-8 h-10 w-36 bg-slate-200/10 dark:bg-slate-800/10 rounded-xl" />
  }>
    <LanguageSwitcherContent />
  </Suspense>
)
