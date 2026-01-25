'use client'

import React from 'react'
import Image from 'next/image'
import { Trophy, ArrowUpRight, ExternalLink, Calendar } from 'lucide-react'
import type { Locale } from '@/i18n-config'

interface FeaturedArticleLinks {
  pt?: string
  en?: string
  es?: string
  [key: string]: string | undefined
}

interface FeaturedArticleData {
  title: string
  description: string
  summaryTitle: string
  summarySnippet: string
  badge: string
  rank: string
  date: string
  readMore: string
  imageAlt: string
  links: FeaturedArticleLinks
}

interface FeaturedArticleSectionProps {
  lang: Locale
  dict: {
    common: {
      articlesTitle: {
        pt: string
        en: string
        es: string
      }
      readIn: {
        pt: string
        en: string
        es: string
      }
    }
    articles: {
      featured: FeaturedArticleData
    }
  }
}

/**
 * FEATURED ARTICLE SECTION
 * Prova social premium — responsiva, multilíngue e SEO-safe
 */
export const FeaturedArticleSection = ({ lang, dict }: FeaturedArticleSectionProps) => {
  const featured = dict?.articles?.featured
  if (!featured) return null

  const articlesTitle =
    dict?.common?.articlesTitle?.[lang] ??
    dict?.common?.articlesTitle?.en ??
    'Articles'

  const readInLabel =
    dict?.common?.readIn?.[lang] ??
    dict?.common?.readIn?.en ??
    'Read in'

  const mainLink =
    featured.links?.[lang] ??
    featured.links?.en ??
    featured.links?.pt ??
    '#'

  return (
    <section
      id="featured-article"
      className="relative py-24 lg:py-32 px-6 lg:px-8 bg-slate-50/50 dark:bg-transparent overflow-hidden scroll-mt-24"
    >
      {/* BACKGROUND DECOR */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] dark:opacity-[0.1]">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-600 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex items-center gap-5 mb-16 md:mb-20 flex-wrap">
          <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400 shadow-xl rotate-[-3deg]">
            <Trophy className="w-8 h-8 md:w-9 md:h-9" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white break-words">
            {articlesTitle}
          </h2>
        </header>

        {/* CARD */}
        <div className="group relative bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[3rem] md:rounded-[4rem] p-8 sm:p-12 md:p-20 shadow-2xl overflow-hidden transition-all duration-700 hover:border-blue-500/40 backdrop-blur-md">

          <div className="grid gap-14 lg:gap-24 lg:grid-cols-2 items-center relative z-10">

            {/* VISUAL */}
            <div className="relative order-1 lg:order-2">
              <div className="relative aspect-[16/10] xl:aspect-video rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-slate-100 dark:border-slate-800">
                <Image
                  src="/images/trofeu-35-edicao.png"
                  alt={featured.imageAlt}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80" />

                <div className="hidden md:block absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                  <h4 className="text-white font-black text-xl mb-2 uppercase tracking-tight break-words">
                    {featured.summaryTitle}
                  </h4>
                  <p className="text-white/80 text-sm leading-relaxed font-medium">
                    {featured.summarySnippet}
                  </p>
                </div>
              </div>

              {/* RANK */}
              <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8 animate-bounce duration-[5000ms]">
                <div className="bg-amber-400 text-amber-950 font-black p-5 md:p-7 rounded-2xl shadow-2xl border-[6px] border-white dark:border-slate-900 rotate-12 flex flex-col items-center min-w-[120px] hover:rotate-0 transition-transform">
                  <Trophy className="w-8 h-8 mb-2" strokeWidth={2.5} />
                  <span className="text-[11px] uppercase tracking-tighter text-center leading-none">
                    {featured.rank}
                  </span>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="order-2 lg:order-1 flex flex-col">
              <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-black text-xs mb-8 uppercase tracking-[0.3em] flex-wrap">
                <Calendar className="w-4 h-4" />
                <span>{featured.date} • {featured.badge}</span>
              </div>

              <h3 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-[0.95] tracking-tighter text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors break-words">
                {featured.title}
              </h3>

              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-medium italic break-words">
                “{featured.description}”
              </p>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-5 flex-wrap">
                <a
                  href={mainLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-4 bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-xl font-black text-lg transition-all hover:shadow-2xl hover:shadow-blue-500/30 active:scale-95"
                >
                  {featured.readMore}
                  <ArrowUpRight className="w-6 h-6" strokeWidth={3} />
                </a>

                <div className="flex gap-3 flex-wrap">
                  {Object.entries(featured.links || {}).map(
                    ([key, url]) =>
                      url &&
                      key !== lang && (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-5 border-2 border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:border-blue-500/50 transition-all uppercase font-black text-xs flex items-center gap-2"
                          title={`${readInLabel} ${key.toUpperCase()}`}
                        >
                          {key.toUpperCase()}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
