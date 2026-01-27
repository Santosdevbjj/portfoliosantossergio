'use client'

/**
 * FEATURED ARTICLE SECTION: Showcase de Publicações e Conquistas
 * -----------------------------------------------------------------------------
 * - Correção: Check de segurança no IntersectionObserver para evitar erro no Vercel.
 * - I18n: Totalmente integrado aos dicionários PT, EN e ES.
 * - Design: Layout premium com suporte a Dark Mode e animações motion-safe.
 */

import React, { useEffect, useRef } from 'react'
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

  // Link para o perfil ou artigo específico no Medium
  const mainLink = "https://medium.com/@santossergioluiz"

  useEffect(() => {
    const currentRef = sectionRef.current
    if (!currentRef || typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        // CORREÇÃO DO LOG DE ERRO: Verificação de existência da entrada
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          window.dispatchEvent(
            new CustomEvent('scrollspy:change', {
              detail: { id: 'articles', section: 'articles' }
            })
          )
        }
      },
      { threshold: 0.3, rootMargin: "-10% 0px -70% 0px" }
    )

    observer.observe(currentRef)
    return () => observer.disconnect()
  }, [])

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
      className="relative scroll-mt-24 py-16 md:py-32 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-transparent overflow-hidden"
    >
      <Script 
        id="schema-person" 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPerson) }} 
      />

      {/* Efeitos de Background (GPU Optimized) */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.08] dark:opacity-[0.15] pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="flex items-center gap-6 mb-12 md:mb-16">
          <div className="p-4 bg-amber-100 dark:bg-amber-900/40 rounded-2xl text-amber-600 dark:text-amber-400 shadow-xl shadow-amber-500/10 -rotate-2">
            <Trophy className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h2 id="featured-article-title" className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
            {dict.articles.title}
          </h2>
        </header>

        <article className="group bg-white dark:bg-slate-900/40 rounded-[2rem] md:rounded-[3rem] p-6 sm:p-10 lg:p-16 border border-slate-200/60 dark:border-slate-800 shadow-2xl transition-all duration-500 hover:border-blue-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            
            {/* Bloco de Imagem */}
            <div className="relative group/image overflow-hidden rounded-[1.5rem] md:rounded-[2rem] shadow-2xl">
              <div className="relative aspect-[4/3] lg:aspect-square transition-transform duration-700 group-hover/image:scale-105">
                <Image
                  src="/images/trofeu-35-edicao.png"
                  alt={dict.articles.awardWinner}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Bloco de Conteúdo */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-3 text-blue-600 dark:text-blue-400 font-black text-[10px] md:text-xs uppercase tracking-widest mb-6 md:mb-8">
                <Calendar className="w-4 h-4" />
                <span>{dict.articles.publishedAt} 2024</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:block" />
                <span className="bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full">
                  {dict.articles.bestOfMonth}
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 leading-[1.1] text-slate-900 dark:text-white tracking-tight">
                {dict.articles.awardWinner}
              </h3>

              <p className="text-base sm:text-lg italic text-slate-600 dark:text-slate-400 mb-8 md:mb-12 leading-relaxed border-l-4 border-blue-500 pl-4 md:pl-6">
                {dict.articles.mediumProfile}
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href={mainLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black inline-flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-500/25"
                >
                  {dict.articles.readMore}
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
