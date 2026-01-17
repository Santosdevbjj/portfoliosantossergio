'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'

export const LanguageSwitcher = () => {
  const pathname = usePathname()
  
  const languages = [
    { code: 'pt', label: 'PT' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' }
  ]

  const getNewPath = (lang: string) => {
    if (!pathname) return `/${lang}`
    const segments = pathname.split('/')
    segments[1] = lang
    return segments.join('/')
  }

  const currentLang = pathname?.split('/')[1] || 'pt'

  return (
    <nav 
      aria-label="Language Selector"
      className="fixed top-6 right-4 sm:right-8 z-[60] flex items-center gap-1 p-1.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-800 shadow-2xl transition-all duration-300 hover:shadow-blue-500/10"
    >
      <div className="pl-2 pr-1 text-slate-400 dark:text-slate-500 hidden sm:block">
        <Globe size={14} />
      </div>
      
      <div className="flex gap-1">
        {languages.map((lang) => {
          const isActive = currentLang === lang.code
          return (
            <Link
              key={lang.code}
              href={getNewPath(lang.code)}
              className={`
                relative px-3 py-1.5 text-[10px] sm:text-xs font-black tracking-wider rounded-xl transition-all duration-300
                ${isActive 
                  ? 'text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }
              `}
            >
              {/* Background animado para o idioma ativo */}
              {isActive && (
                <div className="absolute inset-0 bg-blue-600 rounded-xl -z-10 shadow-lg shadow-blue-600/30 animate-in fade-in zoom-in-95 duration-300" />
              )}
              {lang.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
