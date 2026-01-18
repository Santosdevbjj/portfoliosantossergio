'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export const LanguageSwitcher = () => {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Fundamental para evitar erro de mismatch entre servidor e cliente no Next.js
  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: 'pt', label: 'PT' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' }
  ]

  // Extrai o idioma atual da URL de forma segura
  const currentLang = pathname?.split('/')[1] || 'pt'

  // Função otimizada para troca de rota mantendo a página atual
  const getNewPath = (langCode: string) => {
    if (!pathname) return `/${langCode}`
    const segments = pathname.split('/')
    
    // Verifica se o primeiro segmento é um dos idiomas suportados
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
      aria-label="Preferências do Usuário"
      className="fixed top-4 right-4 sm:top-6 sm:right-8 z-[100] flex items-center gap-2 p-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl transition-all"
    >
      {/* Botão de Tema (Dark/Light) */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-xl text-slate-500 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center min-w-[36px] min-h-[36px]"
        aria-label={theme === 'dark' ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
      >
        {/* Só renderiza o ícone após o cliente montar para evitar erro de hidratação */}
        {!mounted ? (
          <div className="w-5 h-5" />
        ) : theme === 'dark' ? (
          <Sun size={18} className="animate-in fade-in zoom-in duration-300" />
        ) : (
          <Moon size={18} className="animate-in fade-in zoom-in duration-300" />
        )}
      </button>

      {/* Divisor Visual */}
      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" aria-hidden="true" />

      {/* Seleção de Idiomas */}
      <div className="flex gap-1">
        {languages.map((lang) => {
          const isActive = currentLang === lang.code
          return (
            <Link
              key={lang.code}
              href={getNewPath(lang.code)}
              hreflang={lang.code}
              scroll={false} 
              title={`Mudar para ${lang.label}`}
              className={`
                relative px-3 py-1.5 text-[10px] font-black tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center
                ${isActive 
                  ? 'text-white' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300'
                }
              `}
            >
              <span className="relative z-10">{lang.label}</span>
              {isActive && (
                <div 
                  className="absolute inset-0 bg-blue-600 rounded-xl z-0 shadow-md shadow-blue-600/20 animate-in fade-in zoom-in duration-200" 
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
