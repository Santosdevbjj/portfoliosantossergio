'use client'

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { i18n, type Locale } from '@/i18n-config'

/**
 * COMPONENTE: LanguageSwitcherContent
 * Gerencia a lógica de internacionalização e alternância de tema Dark/Light.
 */
const LanguageSwitcherContent = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isDark, toggleTheme } = useTheme()
  
  // Controle de hidratação para evitar mismatch entre Client e Server
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
   * Preserva a página atual e os parâmetros de busca ao trocar o idioma.
   */
  const getNewPath = (langCode: string): string => {
    if (!pathname) return `/${langCode}`
    
    const segments = pathname.split('/')
    // O idioma é sempre o segundo segmento (índice 1) em rotas /pt/...
    const isLangSegment = i18n.locales.includes(segments[1] as Locale)
    
    const newSegments = [...segments]
    if (isLangSegment) {
      newSegments[1] = langCode
    } else {
      // Se por algum motivo não houver segmento de idioma, insere no início
      newSegments.splice(1, 0, langCode)
    }
    
    const newPathname = newSegments.join('/') || '/'
    const params = searchParams?.toString()
    return `${newPathname}${params ? `?${params}` : ''}`
  }

  // Placeholder estável durante a hidratação (evita saltos visuais)
  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 sm:top-6 sm:right-8 h-10 w-36 bg-slate-200/20 dark:bg-slate-800/20 animate-pulse rounded-xl backdrop-blur-md z-[110]" />
    )
  }

  return (
    <nav 
      aria-label="Language and theme settings"
      className="fixed top-4 right-4 sm:top-6 sm:right-8 z-[110] flex items-center gap-1 p-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl ring-1 ring-black/5 transition-all duration-500"
    >
      {/* TOGGLE DE TEMA: Dark / Light */}
      <button
        onClick={() => toggleTheme()}
        className="p-2 rounded-lg text-slate-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all active:scale-90"
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

      {/* Divisor Visual */}
      <div className="w-px h-3 bg-slate-200 dark:bg-slate-800 mx-1" aria-hidden="true" />

      {/* SELETOR DE IDIOMAS */}
      <div className="flex items-center gap-0.5">
        <div className="hidden sm:flex items-center px-1 opacity-40">
          <Globe size={12} />
        </div>
        
        {languages.map((lang) => {
          const isActive = currentLang === lang.code
          return (
            <Link
              key={lang.code}
              href={getNewPath(lang.code) as any}
              hrefLang={lang.code}
              rel="alternate"
              scroll={false}
              className={`
                relative px-2.5 py-1.5 text-[10px] font-black rounded-lg transition-all duration-300 uppercase tracking-tighter
                ${isActive 
                  ? 'text-white' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }
              `}
              aria-label={lang.aria}
            >
              <span className="relative z-10">{lang.label}</span>
              {isActive && (
                <div 
                  className="absolute inset-0 bg-blue-600 rounded-lg z-0 animate-in fade-in zoom-in-95 duration-500 shadow-md shadow-blue-600/20" 
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
 * EXPORT COM SUSPENSE
 * Obrigatório no Next.js 15 quando se usa useSearchParams em componentes Client.
 */
export const LanguageSwitcher = () => (
  <Suspense fallback={null}>
    <LanguageSwitcherContent />
  </Suspense>
)
