'use client'

/**
 * ARTICLES SECTION: Vitrine de Conteúdo Técnico
 * -----------------------------------------------------------------------------
 * - UI: Grid responsivo para artigos do Medium/DIO.
 * - I18n: Totalmente alinhado com o dicionário (PT, EN, ES).
 * - Fix: Correção de erro de tipagem no IntersectionObserver para o build do Vercel.
 */

import React, { useState, useEffect, useRef } from 'react'
import { BookOpen, Award, Calendar, ArrowRight, ExternalLink } from 'lucide-react'
import type { Locale } from '@/i18n-config'
import type { Dictionary } from '@/types/dictionary'

interface ArticlesSectionProps {
  readonly lang: Locale
  readonly dict: Dictionary
}

export default function ArticlesSection({ lang, dict }: ArticlesSectionProps) {
  const [hydrated, setHydrated] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  
  const { articles } = dict

  // Correção do Erro de Compilação: Adição de check de existência para 'entry'
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          setHydrated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="articles"
      className="relative scroll-mt-28 py-20 sm:py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* HEADER DA SEÇÃO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              {articles.title}
            </h2>
            <div className="h-1.5 w-24 bg-blue-600 mt-4 rounded-full" />
          </div>
          
          <a
            href="https://medium.com/@santossergioluiz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-600 hover:text-blue-500 transition-colors group"
          >
            {articles.mediumProfile}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* GRID DE ARTIGOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Exemplo de Card de Artigo alinhado ao dicionário */}
          <ArticleCard 
            title="A Era dos Dados em Sistemas Críticos"
            description="Como a governança de dados transforma sistemas legados em ativos estratégicos de alta disponibilidade."
            date="Set 2025"
            category={articles.bestOfMonth}
            isAward={true}
            awardLabel={articles.awardWinner}
            readMoreLabel={articles.readMore}
            link="#"
          />
          
          <ArticleCard 
            title="Databricks & Governança"
            description="Implementando segurança e conformidade em pipelines de dados modernos utilizando Azure Databricks."
            date="Ago 2025"
            category="Data Engineering"
            isAward={false}
            readMoreLabel={articles.readMore}
            link="#"
          />
        </div>
      </div>
    </section>
  )
}

/**
 * COMPONENTE DE CARD INTERNO
 */
interface ArticleCardProps {
  title: string
  description: string
  date: string
  category: string
  isAward: boolean
  awardLabel?: string
  readMoreLabel: string
  link: string
}

function ArticleCard({ title, description, date, category, isAward, awardLabel, readMoreLabel, link }: ArticleCardProps) {
  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600">
          <BookOpen className="w-6 h-6" />
        </div>
        {isAward && (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 text-[10px] font-black uppercase tracking-wider rounded-full border border-amber-200 dark:border-amber-800/50">
            <Award className="w-3 h-3" />
            {awardLabel}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {date}
        </span>
        <span className="w-1 h-1 bg-slate-300 rounded-full" />
        <span className="text-blue-600">{category}</span>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
        {description}
      </p>

      <a
        href={link}
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-tighter text-slate-900 dark:text-white group-hover:gap-4 transition-all"
      >
        {readMoreLabel}
        <ExternalLink className="w-4 h-4 text-blue-600" />
      </a>
    </div>
  )
}
