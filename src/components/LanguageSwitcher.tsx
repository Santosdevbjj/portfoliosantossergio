'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from 'next-themes'

/**
 * LANGUAGE & THEME SWITCHER
 * Componente flutuante ultra-responsivo com suporte a i18n e modo escuro.
 */
export const LanguageSwitcher = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Impede erros de hidratação (SSR vs Client)
  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: 'pt', label: 'PT', aria: 'Versão em Português' },
    { code: 'en', label: 'EN', aria: 'English Version' },
    { code: 'es', label: 'ES', aria: 'Versión en Español' }
  ] as const;

  // Detecta idioma atual de forma segura
  const currentLang = pathname?.split('/')[1] || 'pt'

  /**
   * getNewPath: Reconstrói a URL para troca de idioma preservando filtros
   */
  const getNewPath = (langCode: string) => {
    if (!pathname) return `/${langCode}`
    const segments = pathname.split('/')
    
    // Se o primeiro segmento após a barra for um idioma conhecido, substitui
    if (languages.some(l => l.code === segments[1])) {
      segments[1] = langCode
    } else {
      segments.splice(1, 0, langCode)
    }
    
    const cleanPath = segments.filter(Boolean).join('/')
    const queryString = searchParams?.toString()
    return `/${cleanPath}${queryString ? `?${queryString}` : ''}`
  }

  // Previne a renderização incorreta do tema antes da montagem no cliente
  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  return (
    <nav 
      aria-label="Preferências de Idioma e Tema"
      className="fixed top-4 right-4 sm:top-6 sm:right-8 z-[100] flex items-center gap-2 p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.25rem] border border-slate-200/50 dark:border-slate-800/50 shadow-2xl transition-all duration-500 hover:border-blue-500/30"
    >
      {/* Botão de Tema com Feedback Visual */}
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="p-2.5 rounded-xl text-slate-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
        aria-label={isDark ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
      >
        {isDark ? (
          <Sun size={20} className="animate-in fade-in zoom-in spin-in-12 duration-700" />
        ) : (
          <Moon size={20} className="animate-in fade-in zoom-in -rotate-12 duration-700" />
        )}
      </button>

      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700/60 mx-1" aria-hidden="true" />

      {/* Seletor de Idiomas */}
      <div className="flex items-center gap-1">
        <Globe size={14} className="text-slate-400 ml-1 hidden sm:block" />
        <div className="flex gap-0.5">
          {languages.map((lang) => {
            const isActive = currentLang === lang.code
            return (
              <Link
                key={lang.code}
                href={getNewPath(lang.code)}
                hreflang={lang.code}
                scroll={false} 
                aria-label={lang.aria}
                className={`
                  relative px-3.5 py-2 text-[12px] font-bold tracking-tight rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }
                `}
              >
                <span className="relative z-10">{lang.label}</span>
                {isActive && (
                  <div 
                    className="absolute inset-0 bg-blue-600 rounded-lg z-0 shadow-lg shadow-blue-600/30 animate-in fade-in zoom-in duration-300" 
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
