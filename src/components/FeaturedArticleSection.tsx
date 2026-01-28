'use client'

/**
 * FEATURED ARTICLE SECTION: Showcase de Publicações e Conquistas
 * -----------------------------------------------------------------------------
 * - UI: Layout de alto impacto para destacar premiações (DIO/Medium).
 * - I18n: Totalmente integrado aos dicionários e adaptado ao idioma ativo.
 * - UX: Efeitos de profundidade e background otimizados para performance.
 */

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import { Trophy, ArrowUpRight, Calendar } from 'lucide-react'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface FeaturedArticleSectionProps {
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export const FeaturedArticleSection = ({ lang, dict }: FeaturedArticleSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { articles } = dict

  // Link centralizado para o Medium
  const mediumLink = "https://medium.com/@santossergioluiz"

  useEffect(() => {
    const currentRef = sectionRef.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          window.dispatchEvent(
            new CustomEvent('scrollspy:change', {
              detail: { id: 'articles' }
            })
          )
        }
      },
      { threshold: 0.2, rootMargin: "-10% 0px -70% 0px" }
    )

    observer.observe(currentRef)
    return () => observer.disconnect()
  }, [])

  // Descrições traduzidas dinamicamente para o destaque
  const featuredDescription = {
    pt: "Análise profunda sobre a convergência entre sistemas legados e governança de dados moderna.",
    en: "In-depth analysis of the convergence between legacy systems and modern data governance.",
    es: "Análisis profundo sobre la convergencia entre sistemas heredados y gobernanza de datos moderna."
  }

  const schemaPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://sergiosantos.dev/#sergio-santos',
    name: 'Sérgio Santos',
    jobTitle: 'Senior Data Specialist',
    sameAs: [
      'https://www.linkedin.com/in/santossergioluiz',
      'https://github.com/Santosdevbjj'
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

      {/* BACKGROUND DECORATIVO (GPU OTIMIZADO) */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.05] dark:opacity-[0.12] pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-soft-light" />
        <div className="absolute bottom-0 right-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-indigo-600 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-soft-light" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* TÍTULO DA SEÇÃO */}
        <header className="flex items-center gap-4 md:gap-6 mb-12 md:mb-16">
          <div className="p-3 md:p-4 bg-amber-100 dark:bg-amber-900/40 rounded-2xl text-amber-600 dark:text-amber-400 shadow-lg -rotate-2">
            <Trophy className="w-7 h-7 md:w-10 md:h-10" />
          </div>
          <h2 id="featured-article-title" className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
            {articles.title}
          </h2>
        </header>

        {/* CARD EM DESTAQUE */}
        <article className="group bg-white dark:bg-slate-900/40 rounded-[2.5rem] p-6 md:p-12 lg:p-16 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-500 hover:border-blue-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* CONTAINER DA IMAGEM */}
            <div className="relative overflow-hidden rounded-[2rem] shadow-xl aspect-[4/3] md:aspect-video lg:aspect-square">
              <Image
                src="/images/trofeu-35-edicao.png"
                alt={articles.awardWinner}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* CONTEÚDO TEXTUAL */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-3 text-blue-600 dark:text-blue-400 font-black text-[10px] md:text-xs uppercase tracking-widest mb-6">
                <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{articles.publishedAt} 2024</span>
                </div>
                <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full">
                  {articles.bestOfMonth}
                </span>
              </div>

              <h3 className="text-2xl md:text-5xl font-black mb-6 leading-[1.15] text-slate-900 dark:text-white tracking-tight">
                {articles.awardWinner}
              </h3>

              <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-8 md:mb-10 leading-relaxed font-medium">
                {featuredDescription[lang]}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href={mediumLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 md:py-5 rounded-2xl font-black inline-flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-500/20 group/btn"
                >
                  {articles.readMore}
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </a>
                
                <a
                  href={mediumLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 md:py-5 rounded-2xl font-black border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center justify-center"
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
