'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export const LanguageSwitcher = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { theme, setTheme } = useTheme()
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

  const currentLang = pathname?.split('/')[1] || 'pt'

  /**
   * getNewPath: Gera a URL mantendo a rota e os parâmetros de busca (query strings)
   */
  const getNewPath = (langCode: string) => {
    if (!pathname) return `/${langCode}`
    const segments = pathname.split('/')
    
    // Substitui o código de idioma no pathname
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
      aria-label="Language and Theme Preferences"
      className="fixed top-3 right-3 sm:top-6 sm:right-8 z-[100] flex items-center gap-1.5 p-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl"
    >
      {/* Dark/Light Mode Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-xl text-slate-500 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
        title={theme === 'dark' ? "Modo Claro" : "Modo Escuro"}
      >
        {theme === 'dark' ? (
          <Sun size={18} className="animate-in fade-in zoom-in spin-in-12 duration-500" />
        ) : (
          <Moon size={18} className="animate-in fade-in zoom-in -rotate-12 duration-500" />
        )}
      </button>

      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700/50" aria-hidden="true" />

      {/* Language Selector Container */}
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
                relative px-3 py-1.5 text-[11px] font-black tracking-tighter rounded-xl transition-all duration-300
                ${isActive 
                  ? 'text-white' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
                }
              `}
            >
              <span className="relative z-10">{lang.label}</span>
              {isActive && (
                <div 
                  className="absolute inset-0 bg-blue-600 rounded-[10px] z-0 shadow-md shadow-blue-600/20 animate-in fade-in zoom-in duration-300" 
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
