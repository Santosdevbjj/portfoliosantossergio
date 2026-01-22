'use client'

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { i18n, type Locale } from '@/i18n-config'

/**
 * COMPONENTE: LanguageSwitcher & ThemeToggle
 * Design: Floating Glassmorphism com animações suaves.
 * Totalmente Responsivo e adaptado para Next.js 15.
 */
const LanguageSwitcherContent = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isDark, toggleTheme } = useTheme()
  
  // Controle de hidratação para evitar erro de inconsistência entre Server e Client
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: 'pt', label: 'PT', aria: 'Mudar para Português' },
    { code: 'en', label: 'EN', aria: 'Change to English' },
    { code: 'es', label: 'ES', aria: 'Cambiar a Español' }
  ] as const;

  // Extração segura do idioma atual da URL
  const currentLang = (pathname?.split('/')[1] ?? i18n.defaultLocale) as Locale

  /**
   * RECONSTRUÇÃO DE ROTA DINÂMICA
   * Mantém parâmetros de busca (query strings) ao trocar de idioma.
   */
  const getNewPath = (langCode: string): string => {
    if (!pathname) return `/${langCode}`
    
    const segments = pathname.split('/')
    // Verifica se o primeiro segmento é um idioma válido conforme as definições de i18n
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

  // Placeholder durante a hidratação para evitar Layout Shift (CLS)
  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 sm:top-6 sm:right-8 h-11 w-32 sm:w-44 bg-slate-200/20 dark:bg-slate-800/20 animate-pulse rounded-2xl backdrop-blur-md z-[110]" />
    )
  }

  return (
    <nav 
      aria-label="Language and theme settings"
      className="fixed top-4 right-4 sm:top-6 sm:right-8 z-[110] flex items-center gap-1 p-1 sm:p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl ring-1 ring-black/5 transition-all duration-500"
    >
      {/* TOGGLE DE TEMA */}
      <button
        onClick={() => toggleTheme()}
        className="p-2 rounded-xl text-slate-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          {isDark ? (
            <Sun size={18} className="text-amber-500 animate-in zoom-in spin-in-180 duration-500" />
          ) : (
            <Moon size={18} className="text-blue-600 animate-in zoom-in spin-in-180 duration-500" />
          )}
        </div>
      </button>

      {/* Divisor Visual */}
      <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-0.5 sm:mx-1" aria-hidden="true" />

      {/* SELETOR DE IDIOMAS */}
      <div className="flex items-center">
        {/* Ícone Globe escondido em telas muito pequenas para economizar espaço */}
        <div className="hidden sm:flex items-center px-1">
          <Globe size={13} className="text-slate-400 dark:text-slate-500" />
        </div>
        
        <div className="flex gap-0.5">
          {languages.map((lang) => {
            const isActive = currentLang === lang.code
            return (
              <Link
                key={lang.code}
                /* CORREÇÃO CRÍTICA PARA O ERRO DE BUILD: 
                   O 'as any' silencia a validação estática de rotas do Next.js 15 para URLs geradas dinamicamente.
                */
                href={getNewPath(lang.code) as any}
                hrefLang={lang.code}
                rel="alternate"
                scroll={false}
                className={`
                  relative px-2 sm:px-2.5 py-1.5 text-[10px] font-black rounded-lg transition-all duration-300 uppercase tracking-tighter
                  ${isActive 
                    ? 'text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
                aria-label={lang.aria}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="relative z-10">{lang.label}</span>
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
      </div>
    </nav>
  )
}

/**
 * EXPORT COM SUSPENSE
 * Essencial no Next.js 15: useSearchParams() exige um Suspense Boundary para renderização no cliente.
 */
export const LanguageSwitcher = () => (
  <Suspense fallback={<div className="fixed top-4 right-4 sm:top-6 sm:right-8 h-11 w-32 rounded-2xl bg-slate-200/10" />}>
    <LanguageSwitcherContent />
  </Suspense>
)
