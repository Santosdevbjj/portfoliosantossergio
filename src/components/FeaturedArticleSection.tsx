'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import { Trophy, ArrowUpRight, Calendar } from 'lucide-react'
import type { Locale, Dictionary } from '@/types/dictionary'

interface FeaturedArticleSectionProps {
  readonly lang: Locale
  readonly dict: Dictionary
}

export const FeaturedArticleSection = ({ lang, dict }: FeaturedArticleSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { articles, common } = dict

  /**
   * ✔ TS-safe:
   * O artigo em destaque pode NÃO existir
   */
  const featuredArticle = articles.items.at(0)
  const mediumLink = common.externalLinks.medium

  /**
   * ✔ Fail-fast
   * Se não houver artigo, a seção não é renderizada
   */
  if (!featuredArticle) {
    return null
  }

  useEffect(() => {
    const currentRef = sectionRef.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          window.dispatchEvent(
            new CustomEvent('scrollspy:change', {
              detail: { id: 'articles' }
            })
          )
        }
      },
      { threshold: 0.2, rootMargin: '-10% 0px -70% 0px' }
    )

    observer.observe(currentRef)
    return () => observer.disconnect()
  }, [])

  const schemaPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://sergiosantos.dev/#sergio-santos',
    name: 'Sérgio Santos',
    jobTitle: common.role,
    sameAs: [
      common.externalLinks.linkedin,
      common.externalLinks.github
    ]
  }

  return (
    <section
      ref={sectionRef}
      id="articles"
      aria-labelledby="featured-article-title"
      className="relative scroll-mt-24 py-16 md:py-32 px-4 sm:px-6 lg:px-8 bg-slate-50/30 dark:bg-transparent overflow-hidden"
    >
      <Script
        id="schema-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPerson) }}
      />

      {/* BACKGROUND */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.05] dark:opacity-[0.12] pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-soft-light" />
        <div className="absolute bottom-0 right-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-indigo-600 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-soft-light" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* TÍTULO */}
        <header className="flex items-center gap-4 md:gap-6 mb-12 md:mb-16">
          <div className="p-3 md:p-4 bg-amber-100 dark:bg-amber-900/40 rounded-2xl text-amber-600 dark:text-amber-400 shadow-lg -rotate-2">
            <Trophy className="w-7 h-7 md:w-10 md:h-10" />
          </div>
          <h2 id="featured-article-title" className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
            {articles.title}
          </h2>
        </header>

        {/* CARD */}
        <article className="group bg-white dark:bg-slate-900/40 rounded-[2.5rem] p-6 md:p-12 lg:p-16 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-500 hover:border-blue-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* IMAGEM */}
            <div className="relative overflow-hidden rounded-[2rem] shadow-xl aspect-[4/3] md:aspect-video lg:aspect-square bg-slate-200 dark:bg-slate-800">
              <Image
                src="/images/trofeu-35-edicao.png"
                alt={featuredArticle.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>

            {/* TEXTO */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-3 text-blue-600 dark:text-blue-400 font-black text-[10px] md:text-xs uppercase tracking-widest mb-6">
                <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{articles.publishedAt} {featuredArticle.date}</span>
                </div>

                {featuredArticle.isAward && (
                  <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full">
                    {articles.bestOfMonth}
                  </span>
                )}
              </div>

              <h3 className="text-2xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white">
                {featuredArticle.title}
              </h3>

              <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-10">
                {featuredArticle.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={featuredArticle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black inline-flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  {articles.readMore}
                  <ArrowUpRight className="w-5 h-5" />
                </a>

                <a
                  href={mediumLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-2xl font-black border border-slate-200 dark:border-slate-800"
                >
                  {articles.mediumProfile}
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
