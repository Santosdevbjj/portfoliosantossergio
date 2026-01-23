'use client'

import React from 'react'
import { ExternalLink, BookOpen, Award } from 'lucide-react'
import type { Locale } from '@/i18n-config'

interface FeaturedArticleProps {
  title: string
  description: string
  links: {
    medium?: string
    linkedin?: string
    external?: string
    pt?: string
    en?: string
    es?: string
  }
  lang: Locale
  dict: {
    badge?: string
    readMore?: string
  }
}

/**
 * FEATURED ARTICLE — CARD DE AUTORIDADE TÉCNICA
 * Totalmente responsivo, multilíngue e resiliente a falhas de i18n.
 */
export const FeaturedArticle = ({
  title,
  description,
  links,
  lang,
  dict
}: FeaturedArticleProps) => {
  /**
   * FALLBACKS MULTILÍNGUES SEGUROS
   */
  const badgeText =
    dict?.badge ??
    {
      pt: 'Artigo em Destaque',
      en: 'Featured Article',
      es: 'Artículo Destacado'
    }[lang]

  const readMoreText =
    dict?.readMore ??
    {
      pt: 'Ler Artigo',
      en: 'Read Article',
      es: 'Leer Artículo'
    }[lang]

  /**
   * SMART LINK RESOLUTION
   * Prioridade: idioma → Medium → LinkedIn → Externo
   */
  const activeLink =
    links?.[lang] ??
    links?.medium ??
    links?.linkedin ??
    links?.external ??
    '#'

  return (
    <article className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-7 md:p-10 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(37,99,235,0.15)] hover:-translate-y-2 flex flex-col h-full overflow-hidden">

      {/* FUNDO DECORATIVO */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-all duration-700 pointer-events-none" />

      {/* HEADER */}
      <header className="flex justify-between items-start mb-8 z-10 gap-4">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 shadow-sm">
          <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
          <span className="text-[10px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-[0.2em] whitespace-nowrap">
            {badgeText}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-all duration-500">
          <BookOpen className="w-6 h-6 md:w-7 md:h-7" />
        </div>
      </header>

      {/* CONTEÚDO */}
      <div className="flex-grow z-10">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-5 leading-tight tracking-tighter group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 break-words">
          {title}
        </h3>

        <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium line-clamp-4 md:line-clamp-3 italic opacity-90">
          “{description}”
        </p>
      </div>

      {/* CTA */}
      <footer className="mt-auto pt-6 z-10">
        <a
          href={activeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-4 w-full py-5 md:py-6 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/10 active:scale-95 touch-manipulation"
          aria-label={`${readMoreText}: ${title}`}
        >
          {readMoreText}
          <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
      </footer>

      {/* BORDA DE FOCO */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-[2.5rem] pointer-events-none transition-all duration-500" />
    </article>
  )
}
