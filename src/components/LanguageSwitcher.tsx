'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

/**
 * COMPONENTE: LanguageSwitcher
 * Função: Alternar idiomas (PT, EN, ES) e Temas (Light/Dark).
 * Design: Flutuante (Glassmorphism) e otimizado para toque mobile.
 */
export const LanguageSwitcher = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Garante que o componente só renderize no cliente para evitar erros de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: 'pt', label: 'PT', aria: 'Mudar para Português' },
    { code: 'en', label: 'EN', aria: 'Switch to English' },
    { code: 'es', label: 'ES', aria: 'Cambiar a Español' }
  ] as const;

  // Extrai o idioma atual da URL de forma segura
  const currentLang = pathname?.split('/')[1] || 'pt'

  /**
   * getNewPath: Altera o prefixo de idioma na URL sem perder a rota interna.
   */
  const getNewPath = (langCode: string) => {
    if (!pathname) return `/${langCode}`
    const segments = pathname.split('/')
    
    // Verifica se o primeiro segmento é um dos idiomas suportados
    const hasLang = languages.some(l => l.code === segments[1])
    
    if (hasLang) {
      segments[1] = langCode
    } else {
      segments.splice(1, 0, langCode)
    }
    
    const cleanPath = segments.filter(Boolean).join('/')
    const queryString = searchParams?.toString()
    return `/${cleanPath}${queryString ? `?${queryString}` : ''}`
  }

  // Se não estiver montado, retorna nulo para evitar saltos visuais (CLS)
  if (!mounted) return null

  return (
    <nav 
      aria-label="Controles de Idioma e Tema"
      className="fixed top-3 right-3 sm:top-6 sm:right-8 z-[100] flex items-center gap-1 p-1 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl"
    >
      {/* Botão de Tema: Área de clique expandida para Touch */}
      <button
        onClick={toggleTheme}
        className="p-3 rounded-xl text-slate-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all active:scale-90"
        aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      >
        <div className="relative w-5 h-5">
          {isDark ? (
            <Sun size={20} className="text-yellow-500 animate-in fade-in zoom-in spin-in-12 duration-500" />
          ) : (
            <Moon size={20} className="text-blue-600 animate-in fade-in zoom-in -rotate-12 duration-500" />
          )}
        </div>
      </button>

      {/* Divisor Visual */}
      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" aria-hidden="true" />

      {/* Grid de Idiomas */}
      <div className="flex items-center gap-0.5 pr-1">
        <Globe size={14} className="text-slate-400 mx-1 hidden xs:block" />
        <div className="flex gap-1">
          {languages.map((lang) => {
            const isActive = currentLang === lang.code
            return (
              <Link
                key={lang.code}
                href={getNewPath(lang.code)}
                hreflang={lang.code}
                scroll={false} 
                className={`
                  relative px-3 py-2 text-[12px] font-bold rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }
                `}
              >
                <span className="relative z-10">{lang.label}</span>
                {isActive && (
                  <div 
                    className="absolute inset-0 bg-blue-600 rounded-lg z-0 shadow-lg shadow-blue-600/30" 
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
