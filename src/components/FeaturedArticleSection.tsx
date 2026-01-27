'use client'

/**
 * FEATURED ARTICLE SECTION: Destaque de Autoridade e Prêmios
 * -----------------------------------------------------------------------------
 * - UI: Card de alto impacto com imagem em destaque e suporte a múltiplos idiomas.
 * - UX: ScrollSpy customizado para sincronia com a Navbar.
 * - SEO: Injeção de Schema.org (Person & CreativeWork).
 */

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import { Trophy, ArrowUpRight, ExternalLink, Calendar } from 'lucide-react'
import type { Locale } from '@/i18n-config'

/* ----------------------------------------------------
 * Tipagens Refinadas
 * --------------------------------------------------*/
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
  readonly lang: Locale
  readonly dict: {
    common: {
      articlesTitle: Record<Locale, string>
      readIn: Record<Locale, string>
    }
    articles: {
      featured: FeaturedArticleData
    }
  }
}

export const FeaturedArticleSection = ({ lang, dict }: FeaturedArticleSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null)

  const featured = dict?.articles?.featured
  if (!featured) return null

  const articlesTitle = dict.common.articlesTitle[lang]
  const readInLabel = dict.common.readIn[lang]

  // Resolução lógica do link principal (Prioriza o idioma atual)
  const mainLink =
    featured.links?.[lang] ??
    featured.links?.en ??
    featured.links?.pt ??
    '#'

  /* -------------------------------------------------
   * 🔁 ScrollSpy — Sincronização com a Navbar
   * ------------------------------------------------*/
  useEffect(() => {
    const currentRef = sectionRef.current
    if (!currentRef || typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.dispatchEvent(
            new CustomEvent('scrollspy:change', {
              detail: { id: 'featured-article', section: 'articles' }
            })
          )
        }
      },
      { threshold: 0.3, rootMargin: "-10% 0px -70% 0px" }
    )

    observer.observe(currentRef)
    return () => observer.disconnect()
  }, [])

  /* -------------------------------------------------
   * 🌍 Schema.org (SEO Dinâmico)
   * ------------------------------------------------*/
  const schemaPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://sergiosantos.dev/#sergio-santos',
    name: 'Sérgio Santos',
    jobTitle: 'Senior Software Engineer',
    sameAs: [
      'https://www.linkedin.com/in/santossergioluiz',
      'https://github.com/Santosdevbjj'
    ]
  }

  const schemaCreativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    headline: featured.title,
    description: featured.description,
    datePublished: featured.date,
    inLanguage: lang,
    author: { '@type': 'Person', name: 'Sérgio Santos' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': mainLink }
  }

  return (
    <section
      ref={sectionRef}
      id="featured-article"
      aria-labelledby="featured-article-title"
      className="relative scroll-mt-24 py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-transparent overflow-hidden"
    >
      {/* SEO Metadata */}
      <Script id="schema-person" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPerson) }} />
      <Script id="schema-work" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaCreativeWork) }} />

      {/* Decorative Blur Background */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.08] dark:opacity-[0.15] pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Seção Header */}
        <header className="flex items-center gap-6 mb-16">
          <div className="p-4 bg-amber-100 dark:bg-amber-900/40 rounded-2xl text-amber-600 dark:text-amber-400 shadow-xl shadow-amber-500/10 -rotate-2">
            <Trophy className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h2 id="featured-article-title" className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
            {articlesTitle}
          </h2>
        </header>

        {/* Artigo Card Principal */}
        <article className="group bg-white dark:bg-slate-900/40 rounded-[3rem] p-6 sm:p-10 lg:p-20 border border-slate-200/60 dark:border-slate-800 shadow-2xl transition-all duration-500 hover:border-blue-500/30">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Imagem com efeito Hover */}
            <div className="relative group/image overflow-hidden rounded-[2rem] shadow-2xl">
              <div className="relative aspect-[4/3] lg:aspect-square xl:aspect-video transition-transform duration-700 group-hover/image:scale-105">
                <Image
                  src="/images/trofeu-35-edicao.png"
                  alt={featured.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Overlay sutil */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Conteúdo de Texto */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest mb-8">
                <Calendar className="w-4 h-4" />
                <span>{featured.date}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full">{featured.badge}</span>
              </div>

              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 leading-[1.1] text-slate-900 dark:text-white tracking-tight">
                {featured.title}
              </h3>

              <p className="text-lg sm:text-xl italic text-slate-600 dark:text-slate-400 mb-12 leading-relaxed border-l-4 border-blue-500 pl-6">
                “{featured.description}”
              </p>

              {/* Ações / Links */}
              <div className="flex flex-wrap gap-4 mt-auto">
                <a
                  href={mainLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black inline-flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-500/25"
                >
                  {featured.readMore}
                  <ArrowUpRight className="w-5 h-5" />
                </a>

                {/* Alternativas de Idioma */}
                {Object.entries(featured.links).map(
                  ([key, url]) =>
                    url &&
                    key !== lang && (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto border border-slate-200 dark:border-slate-800 px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest inline-flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        {readInLabel} {key.toUpperCase()}
                        <ExternalLink className="w-4 h-4 opacity-50" />
                      </a>
                    )
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
