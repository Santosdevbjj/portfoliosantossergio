'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Moon, Sun, Languages } from 'lucide-react'
import { useTheme } from 'next-themes'

export const LanguageSwitcher = () => {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Evita erros de hidratação (mismatch) no Next.js App Router
  useEffect(() => {
    setMounted(true)
  }, [])

  // Definição dos idiomas suportados conforme nossa estrutura modular
  const languages = [
    { code: 'pt', label: 'PT', aria: 'Mudar para Português' },
    { code: 'en', label: 'EN', aria: 'Switch to English' },
    { code: 'es', label: 'ES', aria: 'Cambiar a Español' }
  ] as const;

  // Extrai o idioma atual da URL (ex: /en/projects -> en)
  const currentLang = pathname?.split('/')[1] || 'pt'

  /**
   * Gera a nova URL mantendo a rota interna.
   * Exemplo: Se estiver em /pt/artigos e clicar em 'EN', vai para /en/artigos.
   */
  const getNewPath = (langCode: string) => {
    if (!pathname) return `/${langCode}`
    const segments = pathname.split('/')
    
    // Se o primeiro segmento após a barra for um código de idioma, substitui
    if (languages.some(l => l.code === segments[1])) {
      segments[1] = langCode
    } else {
      // Caso contrário (fallback), insere o idioma no início
      segments.splice(1, 0, langCode)
    }
    
    const cleanPath = segments.filter(Boolean).join('/')
    return `/${cleanPath}`
  }

  // Previne renderização inconsistente antes do mount no cliente
  if (!mounted) return null

  return (
    <nav 
      aria-label="Preferências de Idioma e Tema"
      className="fixed top-4 right-4 sm:top-6 sm:right-8 z-[100] flex items-center gap-2 p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl transition-all duration-300"
    >
      {/* Alternador de Tema: Sol/Lua */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2.5 rounded-xl text-slate-500 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
        aria-label={theme === 'dark' ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
      >
        {theme === 'dark' ? (
          <Sun size={18} className="animate-in fade-in zoom-in spin-in-12 duration-500" />
        ) : (
          <Moon size={18} className="animate-in fade-in zoom-in -rotate-12 duration-500" />
        )}
      </button>

      {/* Divisor Estilizado */}
      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700/50 mx-1" aria-hidden="true" />

      {/* Seletor de Idiomas */}
      <div className="flex gap-1 items-center">
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
                relative px-3.5 py-1.5 text-[10px] font-black tracking-widest rounded-xl transition-all duration-300
                ${isActive 
                  ? 'text-white' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }
              `}
            >
              <span className="relative z-10">{lang.label}</span>
              {isActive && (
                <div 
                  className="absolute inset-0 bg-blue-600 rounded-xl z-0 shadow-lg shadow-blue-600/30 animate-in fade-in zoom-in duration-300" 
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
