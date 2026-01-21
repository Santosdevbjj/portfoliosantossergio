'use client'

import React, { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { i18n } from '@/i18n-config'

/**
 * COMPONENTE: LanguageSwitcher & ThemeToggle
 * Design: Floating Glassmorphism com animações suaves.
 * Gerencia a troca de idioma e o tema Dark/Light preservando rotas e parâmetros.
 */
const LanguageSwitcherContent = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Hidratação segura: essencial para evitar conflitos entre Server e Client Side
  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: 'pt', label: 'PT', aria: 'Mudar para Português' },
    { code: 'en', label: 'EN', aria: 'Change to English' },
    { code: 'es', label: 'ES', aria: 'Cambiar a Español' }
  ] as const;

  // Identifica o idioma atual de forma segura
  const currentLang = pathname?.split('/')[1] || i18n.defaultLocale

  /**
   * RECONSTRUÇÃO DE ROTA: Troca o locale preservando o restante do caminho
   */
  const getNewPath = (langCode: string) => {
    if (!pathname) return `/${langCode}`
    
    const segments = pathname.split('/')
    // Verifica se o primeiro segmento é um locale válido
    const isLangSegment = i18n.locales.includes(segments[1] as any)
    
    const newSegments = [...segments]
    if (isLangSegment) {
      newSegments[1] = langCode
    } else {
      newSegments.splice(1, 0, langCode)
    }
    
    const newPathname = newSegments.join('/')
    const params = searchParams?.toString()
    return `${newPathname}${params ? `?${params}` : ''}`
  }

  // Fallback de carregamento para evitar saltos visuais (CLS)
  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 sm:top-6 sm:right-8 h-10 w-40 bg-slate-200/20 dark:bg-slate-800/20 animate-pulse rounded-xl backdrop-blur-md" />
    )
  }

  return (
    <nav 
      aria-label="Language and theme settings"
      className="fixed top-4 right-4 sm:top-6 sm:right-8 z-[110] flex items-center gap-1 p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl ring-1 ring-black/5 transition-all duration-300"
    >
      {/* TOGGLE DE TEMA (DARK/LIGHT) */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-xl text-slate-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all active:scale-90 focus:outline-none"
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
      <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" aria-hidden="true" />

      {/* SELETOR DE IDIOMAS */}
      <div className="flex items-center">
        {/* Ícone de Globo: Oculto em telas muito pequenas para economizar espaço */}
        <div className="hidden sm:flex items-center px-1.5">
          <Globe size={14} className="text-slate-400" />
        </div>
        
        <div className="flex gap-0.5">
          {languages.map((lang) => {
            const isActive = currentLang === lang.code
            return (
              <Link
                key={lang.code}
                href={getNewPath(lang.code)}
                hreflang={lang.code}
                scroll={false} // Evita pular para o topo ao trocar idioma
                className={`
                  relative px-2.5 py-1.5 text-[10px] font-black rounded-lg transition-all duration-300 uppercase tracking-widest
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
 * Obrigatório no Next.js ao usar hooks como useSearchParams em Client Components.
 */
export const LanguageSwitcher = () => (
  <Suspense fallback={null}>
    <LanguageSwitcherContent />
  </Suspense>
)
