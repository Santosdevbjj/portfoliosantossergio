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

  // Identifica o idioma atual da URL (ex: de /en/about pega 'en')
  const currentLang = pathname?.split('/')[1] || 'pt'

  const getNewPath = (lang: string) => {
    if (!pathname) return `/${lang}`
    
    const segments = pathname.split('/')
    // A estrutura do Next.js App Router com [lang] coloca o idioma no primeiro segmento
    // Se o primeiro segmento após a barra for um dos nossos idiomas, nós o substituímos
    if (languages.some(l => l.code === segments[1])) {
      segments[1] = lang
    } else {
      // Caso a URL não tenha idioma (ex: rota 404), inserimos o idioma
      segments.splice(1, 0, lang)
    }
    
    return segments.join('/') || `/${lang}`
  }

  return (
    <nav 
      aria-label="Language Selector"
      className="fixed top-6 right-4 sm:right-8 z-[100] flex items-center gap-1 p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-2xl transition-all duration-300"
    >
      <div className="pl-2 pr-1 text-blue-600 dark:text-blue-400 hidden sm:block" aria-hidden="true">
        <Globe size={16} className="animate-pulse" />
      </div>
      
      <div className="flex gap-1">
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
              title={lang.name}
              className={`
                relative px-3 py-1.5 text-[10px] sm:text-xs font-black tracking-widest rounded-xl transition-all duration-300 outline-none
                ${isActive 
                  ? 'text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }
              `}
            >
              <span className="relative z-10">{lang.label}</span>
              
              {isActive && (
                <div 
                  className="absolute inset-0 bg-blue-600 rounded-xl z-0 shadow-lg shadow-blue-600/30" 
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
