'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

/**
 * COMPONENTE: LanguageSwitcher & ThemeToggle
 * Design: Floating Glassmorphism (Neomorfismo Moderno)
 * Otimizado para UX Mobile e Conformidade SEO.
 */
export const LanguageSwitcher = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Evita erros de hidratação (Next.js 15)
  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: 'pt', label: 'PT', aria: 'Mudar para Português' },
    { code: 'en', label: 'EN', aria: 'Switch to English' },
    { code: 'es', label: 'ES', aria: 'Cambiar a Español' }
  ] as const;

  // Extração segura do idioma atual da URL
  const currentLang = pathname?.split('/')[1] || 'pt'

  /**
   * getNewPath: Reconstrói a URL mantendo a rota e os parâmetros de busca.
   */
  const getNewPath = (langCode: string) => {
    if (!pathname) return `/${langCode}`
    
    const segments = pathname.split('/')
    // Remove o idioma atual se ele existir na URL
    const hasLang = languages.some(l => l.code === segments[1])
    
    if (hasLang) {
      segments[1] = langCode
    } else {
      segments.splice(1, 0, langCode)
    }
    
    const newPathname = segments.join('/')
    const params = searchParams?.toString()
    return `${newPathname}${params ? `?${params}` : ''}`
  }

  // Previne Layout Shift (CLS)
  if (!mounted) return <div className="fixed top-3 right-3 h-12 w-40 bg-transparent" />

  return (
    <nav 
      aria-label="Controles de Idioma e Tema"
      className="fixed top-3 right-3 sm:top-6 sm:right-8 z-[100] flex items-center gap-1 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[1.25rem] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl ring-1 ring-black/5"
    >
      {/* MUDANÇA DE TEMA (DARK/LIGHT) */}
      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-xl text-slate-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
        title={isDark ? "Modo Claro" : "Modo Escuro"}
        aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          {isDark ? (
            <Sun size={19} className="text-yellow-500 animate-in zoom-in duration-300" />
          ) : (
            <Moon size={19} className="text-blue-600 animate-in zoom-in duration-300" />
          )}
        </div>
      </button>

      {/* Divisor vertical discreto */}
      <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" aria-hidden="true" />

      {/* SELETOR DE IDIOMAS */}
      <div className="flex items-center gap-1">
        <div className="hidden xs:flex items-center px-2">
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
                    ? 'text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
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
