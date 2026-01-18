'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export const LanguageSwitcher = () => {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Evita erro de hidratação para componentes que dependem do Client (como o tema)
  useEffect(() => setMounted(true), [])

  const languages = [
    { code: 'pt', label: 'PT' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' }
  ]

  const currentLang = pathname?.split('/')[1] || 'pt'

  const getNewPath = (langCode: string) => {
    if (!pathname) return `/${langCode}`
    const segments = pathname.split('/')
    if (languages.some(l => l.code === segments[1])) {
      segments[1] = langCode
    } else {
      segments.splice(1, 0, langCode)
    }
    const cleanPath = segments.filter(Boolean).join('/')
    return cleanPath ? `/${cleanPath}` : `/${langCode}`
  }

  return (
    <nav 
      aria-label="User Preferences"
      className="fixed top-4 right-4 sm:top-6 sm:right-8 z-[100] flex items-center gap-2 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl transition-all animate-fade-in"
    >
      {/* Botão de Tema Integrado */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-xl text-slate-500 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle Theme"
      >
        {!mounted ? <div className="w-5 h-5" /> : theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Divisor Visual */}
      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" aria-hidden="true" />

      {/* Seleção de Idiomas */}
      <div className="flex gap-0.5">
        {languages.map((lang) => {
          const isActive = currentLang === lang.code
          return (
            <Link
              key={lang.code}
              href={getNewPath(lang.code)}
              hreflang={lang.code}
              lang={lang.code}
              scroll={false} 
              className={`
                relative px-3 py-1.5 text-[10px] font-black tracking-widest rounded-xl transition-all duration-300
                ${isActive 
                  ? 'text-white' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300'
                }
              `}
            >
              <span className="relative z-10">{lang.label}</span>
              {isActive && (
                <div 
                  className="absolute inset-0 bg-blue-600 rounded-xl z-0 shadow-md shadow-blue-600/20" 
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
