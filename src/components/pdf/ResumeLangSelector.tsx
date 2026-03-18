'use client'

import { useTransition, type JSX } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Check, Languages, Loader2 } from 'lucide-react'
import type { SupportedLocale } from "@/dictionaries/locales"

interface ResumeLangSelectorProps {
  readonly currentLang: SupportedLocale;
  readonly dict: {
    selectLanguage: string;
    languages: Record<SupportedLocale, string>;
  };
}

export function ResumeLangSelector({ currentLang, dict }: ResumeLangSelectorProps): JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const locales: SupportedLocale[] = ['pt-BR', 'en-US', 'es-ES']

  const handleLangChange = (newLang: SupportedLocale) => {
    if (newLang === currentLang || isPending) return;

    // Regex robusta: substitui o código de idioma logo após a primeira barra
    // Exemplo: /pt-BR/resume -> /en-US/resume
    const segments = pathname.split('/')
    segments[1] = newLang
    const newPathname = segments.join('/')
    
    startTransition(() => {
      // O segredo está no { scroll: false }
      // Isso impede que o Next.js jogue o usuário para o topo da página
      router.push(newPathname, { scroll: false })
    })
  }

  return (
    <section className="flex flex-col gap-3 p-5 bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          {isPending ? (
            <Loader2 size={16} className="animate-spin text-blue-500" />
          ) : (
            <Languages size={16} className="text-blue-500" />
          )}
          <span className="text-[10px] font-black uppercase tracking-[0.15em]">
            {dict.selectLanguage}
          </span>
        </div>
        
        {isPending && (
          <span className="text-[10px] text-blue-500 font-bold animate-pulse">
            UPDATING...
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
        {locales.map((langCode) => {
          const isActive = currentLang === langCode
          
          return (
            <button
              key={langCode}
              onClick={() => handleLangChange(langCode)}
              disabled={isPending}
              type="button"
              className={`
                relative flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-x-1' 
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }
                ${isPending ? 'opacity-70 cursor-wait' : 'cursor-pointer active:scale-95'}
              `}
            >
              <span>{dict.languages[langCode]}</span>
              {isActive && (
                <Check size={14} strokeWidth={4} className="text-white" />
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
