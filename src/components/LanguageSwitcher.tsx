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
 * Gerencia a troca de idioma e o tema Dark/Light preservando rotas.
 */
const LanguageSwitcherContent = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Hidratação segura para Next.js 15
  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: 'pt', label: 'PT', aria: 'Português' },
    { code: 'en', label: 'EN', aria: 'English' },
    { code: 'es', label: 'ES', aria: 'Español' }
  ] as const;

  // Idioma atual extraído da URL ou padrão
  const currentLang = pathname?.split('/')[1] || i18n.defaultLocale

  /**
   * Reconstrói o caminho para o novo idioma preservando a página atual.
   */
  const getNewPath = (langCode: string) => {
    if (!pathname) return `/${langCode}`
    
    const segments = pathname.split('/')
    // Verifica se o primeiro segmento é um dos idiomas suportados
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

  // Previne oscilação de layout (CLS)
  if (!mounted) {
    return (
      <div className="fixed top-3 right-3 sm:top-6 sm:right-8 h-12 w-48 bg-slate-200/20 dark:bg-slate-800/20 animate-pulse rounded-2xl backdrop-blur-md" />
    )
  }

  return (
    <nav 
      aria-label="Configurações de Idioma e Tema"
      className="fixed top-3 right-3 sm:top-6 sm:right-8 z-[110] flex items-center gap-1 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl ring-1 ring-black/5"
    >
      {/* TEMA: Botão com Feedback Visual Intuitivo */}
      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-xl text-slate-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          {isDark ? (
            <Sun size={20} className="text-amber-500 animate-in zoom-in spin-in-90 duration-500" />
          ) : (
            <Moon size={20} className="text-blue-600 animate-in zoom-in spin-in-90 duration-500" />
          )}
        </div>
      </button>

      {/* Divisor */}
      <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" aria-hidden="true" />

      {/* IDIOMAS: Container Compacto e Flexível */}
      <div className="flex items-center gap-0.5">
        <div className="hidden min-[450px]:flex items-center px-1.5">
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
                className={`
                  relative px-3 py-2 text-[10px] font-black rounded-lg transition-all duration-300 uppercase tracking-tighter
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
                    className="absolute inset-0 bg-blue-600 rounded-lg z-0 animate-in fade-in zoom-in-95 duration-300 shadow-md shadow-blue-600/20" 
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
 * WRAPPER: Necessário para usar useSearchParams() no Next.js
 */
export const LanguageSwitcher = () => (
  <Suspense fallback={null}>
    <LanguageSwitcherContent />
  </Suspense>
)
