'use client'

import React from 'react'
import { BookText, PenTool, Share2 } from 'lucide-react'
import { FeaturedArticle } from './FeaturedArticle'
import type { Locale } from '@/i18n-config'

interface FeaturedArticleData {
  title: string
  description: string
  links: {
    medium?: string
    linkedin?: string
    external?: string
  }
}

interface ArticlesSectionProps {
  lang: Locale
  dict: {
    nav?: {
      articles?: string
    }
    articles?: {
      subtitle?: string
      loading?: string
      comingSoon?: string
      followPrompt?: string
      badge?: string
      readMore?: string
      networksLabel?: string
      featured?: FeaturedArticleData
    }
  }
}

/**
 * ARTICLES SECTION — VITRINE DE AUTORIDADE TÉCNICA
 * Totalmente responsiva, multilíngue e segura para ISR/SSG.
 */
export const ArticlesSection = ({ lang, dict }: ArticlesSectionProps) => {
  /**
   * NORMALIZAÇÃO DEFENSIVA DO DICIONÁRIO
   * Evita crashes em build, ISR ou idiomas incompletos
   */
  const navArticles =
    dict?.nav?.articles ?? 'Articles'

  const articlesDict = {
    subtitle: dict?.articles?.subtitle ?? 'Insights & Technical Writing',
    loading: dict?.articles?.loading ?? 'Loading content...',
    comingSoon: dict?.articles?.comingSoon ?? 'More content is being prepared.',
    followPrompt: dict?.articles?.followPrompt ?? 'Follow my publications and updates.',
    networksLabel: dict?.articles?.networksLabel ?? 'Medium & LinkedIn',
    badge: dict?.articles?.badge ?? 'Featured',
    readMore: dict?.articles?.readMore ?? 'Read Article',
    featured: dict?.articles?.featured
  }

  const featured = articlesDict.featured

  return (
    <section
      id="articles"
      className="py-24 lg:py-32 bg-white dark:bg-[#020617] transition-colors duration-500 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* CABEÇALHO */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-16 md:mb-24">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 flex-shrink-0 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <BookText className="w-7 h-7 md:w-10 md:h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
              {navArticles}
            </h2>
            <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 font-medium italic opacity-80">
              {articlesDict.subtitle}
            </p>
          </div>
        </header>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* DESTAQUE */}
          {featured ? (
            <div className="lg:col-span-2 animate-in fade-in slide-in-from-left-8 duration-1000">
              <FeaturedArticle
                title={featured.title}
                description={featured.description}
                links={featured.links}
                lang={lang}
                dict={{
                  badge: articlesDict.badge,
                  readMore: articlesDict.readMore
                }}
              />
            </div>
          ) : (
            <div className="lg:col-span-2 p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-900/30 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[400px]">
              <div className="p-5 bg-white dark:bg-slate-800 rounded-full mb-6 shadow-sm">
                <PenTool className="w-10 h-10 text-blue-500 animate-pulse" />
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] text-center">
                {articlesDict.loading}
              </p>
            </div>
          )}

          {/* COLUNA LATERAL */}
          <aside className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">

            {/* STATUS */}
            <div className="flex-1 flex flex-col justify-center p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 backdrop-blur-sm transition-all hover:border-blue-500/40 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <PenTool className="w-24 h-24 rotate-12" />
              </div>
              <div className="relative z-10 space-y-5 text-center lg:text-left">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform mx-auto lg:mx-0">
                  <PenTool className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-bold leading-relaxed">
                  {articlesDict.comingSoon}
                </p>
              </div>
            </div>

            {/* REDES */}
            <div className="flex-1 flex flex-col justify-center p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 backdrop-blur-sm transition-all hover:border-blue-500/40 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Share2 className="w-24 h-24 -rotate-12" />
              </div>
              <div className="relative z-10 space-y-5 text-center lg:text-left">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mx-auto lg:mx-0">
                  <Share2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                    {articlesDict.networksLabel}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                    {articlesDict.followPrompt}
                  </p>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </section>
  )
}
