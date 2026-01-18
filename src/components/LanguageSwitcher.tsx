'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'

export const LanguageSwitcher = () => {
  const pathname = usePathname()
  
  const languages = [
    { code: 'pt', label: 'PT', name: 'Português' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'es', label: 'ES', name: 'Español' }
  ]

  // Identifica o idioma atual de forma robusta
  const currentLang = pathname?.split('/')[1] || 'pt'

  const getNewPath = (langCode: string) => {
    if (!pathname) return `/${langCode}`
    
    const segments = pathname.split('/')
    // Se o primeiro segmento (Ex: /pt/...) for um idioma conhecido, substitui
    if (languages.some(l => l.code === segments[1])) {
      segments[1] = langCode
    } else {
      // Caso contrário, insere o idioma (útil para rotas raiz ou 404)
      segments.splice(1, 0, langCode)
    }
    
    // Filtra segmentos vazios para evitar URLs como //en/
    return segments.filter(Boolean).join('/') ? `/${segments.filter(Boolean).join('/')}` : `/${langCode}`
  }

  return (
    <nav 
      aria-label="Language Selector"
      className="fixed top-6 right-4 sm:right-8 z-[100] flex items-center gap-1 p-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl transition-all animate-fade-in"
    >
      <div className="pl-2 pr-1 text-blue-600 dark:text-blue-400 hidden xs:block" aria-hidden="true">
        <Globe size={14} className="animate-soft-pulse" />
      </div>
      
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
              aria-current={isActive ? 'page' : undefined}
              className={`
                relative px-3 py-2 text-[10px] font-black tracking-widest rounded-xl transition-all duration-300
                ${isActive 
                  ? 'text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }
              `}
            >
              <span className="relative z-10">{lang.label}</span>
              
              {isActive && (
                <div 
                  className="absolute inset-0 bg-blue-600 rounded-xl z-0" 
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
