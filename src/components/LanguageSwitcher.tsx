'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { i18n } from '@/i18n-config'

/**
 * COMPONENTE: LanguageSwitcher & ThemeToggle
 * Design: Floating Glassmorphism
 * Resolve o redirecionamento multilingue e controle de tema dark/light.
 */
export const LanguageSwitcher = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Hidratação segura para evitar erros de disparidade Server/Client no Next.js 15
  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: 'pt', label: 'PT', aria: 'Mudar para Português' },
    { code: 'en', label: 'EN', aria: 'Switch to English' },
    { code: 'es', label: 'ES', aria: 'Cambiar a Español' }
  ] as const;

  // Extração robusta do idioma atual baseada na configuração i18n
  const currentLang = pathname?.split('/')[1] || i18n.defaultLocale

  /**
   * getNewPath: Reconstrói o caminho para o novo idioma
   * Preserva a rota interna (ex: /about) e parâmetros de busca (query params).
   */
  const getNewPath = (langCode: string) => {
    if (!pathname) return `/${langCode}`
    
    const segments = pathname.split('/')
    // Verifica se o primeiro segmento é um dos idiomas suportados
    const isLangSegment = i18n.locales.includes(segments[1] as any)
    
    if (isLangSegment) {
      segments[1] = langCode
    } else {
      segments.splice(1, 0, langCode)
    }
    
    const newPathname = segments.join('/')
    const params = searchParams?.toString()
    return `${newPathname}${params ? `?${params}` : ''}`
  }

  // Previne o "Cumulative Layout Shift" (CLS) durante a montagem
  if (!mounted) {
    return (
      <div className="fixed top-3 right-3 sm:top-6 sm:right-8 h-11 w-44 bg-slate-100/50 dark:bg-slate-800/50 animate-pulse rounded-[1.25rem]" />
    )
  }

  return (
    <nav 
      aria-label="Configurações de Idioma e Tema"
      className="fixed top-3 right-3 sm:top-6 sm:right-8 z-[110] flex items-center gap-1 p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.25rem] border border-slate-200/50 dark:border-slate-800/50 shadow-2xl ring-1 ring-black/5"
    >
      {/* TOGGLE DE TEMA: Otimizado para feedback tátil */}
      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-xl text-slate-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        title={isDark ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
        aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          {isDark ? (
            <Sun size={19} className="text-yellow-500 transition-all rotate-0 scale-100" />
          ) : (
            <Moon size={19} className="text-blue-600 transition-all rotate-0 scale-100" />
          )}
        </div>
      </button>

      {/* Divisor Visual */}
      <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" aria-hidden="true" />

      {/* SELETOR DE IDIOMAS: Layout Flexível */}
      <div className="flex items-center gap-0.5">
        <div className="hidden min-[400px]:flex items-center px-1.5">
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
                scroll={false} 
                className={`
                  relative px-3 py-2 text-[11px] font-black rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
                aria-label={lang.aria}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="relative z-10">{lang.label}</span>
                {isActive && (
                  <div 
                    className="absolute inset-0 bg-blue-600 rounded-lg z-0 animate-in fade-in zoom-in-95 duration-300" 
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
