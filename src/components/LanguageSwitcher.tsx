'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme' // Ajustado para usar seu hook real

/**
 * LANGUAGE & THEME SWITCHER
 * Componente flutuante ultra-responsivo.
 * No celular, ele se mantém discreto mas acessível.
 */
export const LanguageSwitcher = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isDark, toggleTheme } = useTheme() // Usando sua lógica customizada
  const [mounted, setMounted] = useState(false)
  
  // Impede erros de hidratação (necessário em componentes Client que usam estado)
  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: 'pt', label: 'PT', aria: 'Versão em Português' },
    { code: 'en', label: 'EN', aria: 'English Version' },
    { code: 'es', label: 'ES', aria: 'Versión en Español' }
  ] as const;

  // Detecta idioma atual de forma segura pela URL
  const currentLang = pathname?.split('/')[1] || 'pt'

  /**
   * Reconstrói a URL para troca de idioma preservando o caminho atual
   */
  const getNewPath = (langCode: string) => {
    if (!pathname) return `/${langCode}`
    const segments = pathname.split('/')
    
    // Substitui ou insere o código do idioma na URL
    if (languages.some(l => l.code === segments[1])) {
      segments[1] = langCode
    } else {
      segments.splice(1, 0, langCode)
    }
    
    const cleanPath = segments.filter(Boolean).join('/')
    const queryString = searchParams?.toString()
    return `/${cleanPath}${queryString ? `?${queryString}` : ''}`
  }

  if (!mounted) return null

  return (
    <nav 
      aria-label="Preferências de Idioma e Tema"
      className="fixed top-3 right-3 sm:top-6 sm:right-8 z-[100] flex items-center gap-1.5 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl transition-all duration-300"
    >
      {/* Botão de Tema - Otimizado para Toque no Celular */}
      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-xl text-slate-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
        aria-label={isDark ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
      >
        {isDark ? (
          <Sun size={20} className="text-yellow-500 transition-transform duration-500 rotate-0" />
        ) : (
          <Moon size={20} className="text-blue-600 transition-transform duration-500 -rotate-12" />
        )}
      </button>

      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700/60 mx-0.5" aria-hidden="true" />

      {/* Seletor de Idiomas */}
      <div className="flex items-center gap-0.5">
        <Globe size={14} className="text-slate-400 ml-1 hidden xs:block" />
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
                  relative px-3 py-2 text-[11px] font-bold tracking-tighter rounded-lg transition-all
                  ${isActive 
                    ? 'text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }
                `}
              >
                <span className="relative z-10 uppercase">{lang.label}</span>
                {isActive && (
                  <div 
                    className="absolute inset-0 bg-blue-600 rounded-lg z-0 shadow-md shadow-blue-600/40" 
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
