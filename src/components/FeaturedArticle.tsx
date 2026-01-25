'use client'

import React, { useEffect, useRef } from 'react'
import { ExternalLink, BookOpen, Award } from 'lucide-react'
import type { Locale } from '@/i18n-config'
import { useScrollSpy } from '@/components/scrollspy/ScrollSpyContext'

interface FeaturedArticleProps {
  id: string
  title: string
  description: string
  links?: {
    medium?: string
    linkedin?: string
    external?: string
    pt?: string
    en?: string
    es?: string
  }
  lang: Locale
  dict?: {
    badge?: string
    readMore?: string
  }
}

/**
 * FEATURED ARTICLE
 * 🔁 Integrado ao ScrollSpy + Navbar
 * 🌍 SEO com Schema.org Article
 */
export const FeaturedArticle = ({
  id,
  title,
  description,
  links = {},
  lang,
  dict
}: FeaturedArticleProps) => {
  const ref = useRef<HTMLElement | null>(null)
  const { registerSection } = useScrollSpy()

  /* ---------------------------------------------
   * 🔁 ScrollSpy registration
   * --------------------------------------------*/
  useEffect(() => {
    if (!ref.current) return

    registerSection({
      id,
      ref,
      label: title
    })
  }, [id, title, registerSection])

  /* ---------------------------------------------
   * 🌍 i18n fallbacks
   * --------------------------------------------*/
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

  /* ---------------------------------------------
   * 🔗 Smart link resolution
   * --------------------------------------------*/
  const activeLink =
    links[lang] ??
    links.medium ??
    links.linkedin ??
    links.external ??
    '#'

  /* ---------------------------------------------
   * 🌍 Schema.org Article
   * --------------------------------------------*/
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    inLanguage: lang,
    author: {
      '@type': 'Person',
      name: 'Sérgio Santos'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': activeLink
    }
  }

  return (
    <>
      {/* 🌍 SEO — Schema.org Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article
        ref={ref}
        id={id}
        data-scrollspy-section
        className="group relative flex flex-col h-full bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-7 md:p-10 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(37,99,235,0.15)]"
        aria-labelledby={`${id}-title`}
      >
        {/* FUNDO DECORATIVO */}
        <div
          aria-hidden
          className="absolute top-0 right-0 -mr-24 -mt-24 w-56 h-56 bg-blue-600/5 rounded-full blur-3xl transition-all duration-700 group-hover:bg-blue-600/10 pointer-events-none"
        />

        {/* HEADER */}
        <header className="flex items-start justify-between gap-4 mb-8 z-10">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 shadow-sm">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span className="text-[10px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-[0.18em]">
              {badgeText}
            </span>
          </div>

          <div
            aria-hidden
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 transition-all duration-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30"
          >
            <BookOpen className="w-6 h-6 md:w-7 md:h-7" />
          </div>
        </header>

        {/* CONTEÚDO */}
        <div className="flex-grow z-10">
          <h3
            id={`${id}-title`}
            className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-5 leading-tight tracking-tighter break-words transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          >
            {title}
          </h3>

          <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic opacity-90 line-clamp-4 md:line-clamp-3">
            “{description}”
          </p>
        </div>

        {/* CTA */}
        <footer className="mt-auto pt-8 z-10">
          <a
            href={activeLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${readMoreText}: ${title}`}
            className="flex items-center justify-center gap-4 w-full py-5 md:py-6 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/10 active:scale-95"
          >
            {readMoreText}
            <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </footer>

        {/* BORDA DE FOCO */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-[2.5rem] border-2 border-transparent transition-all duration-500 pointer-events-none group-hover:border-blue-500/20"
        />
      </article>
    </>
  )
}
