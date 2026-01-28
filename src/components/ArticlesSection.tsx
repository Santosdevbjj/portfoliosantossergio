'use client'

/**
 * ARTICLES SECTION: Vitrine de Conteúdo Técnico
 * -----------------------------------------------------------------------------
 * - UI: Grid responsivo otimizado para leitura e legibilidade técnica.
 * - I18n: Sincronizado com SupportedLocale (PT, EN, ES) e Dictionary.
 * - Performance: Intersection Observer para ativação de animações apenas em view.
 */

import { useState, useEffect, useRef } from 'react'
import { BookOpen, Award, Calendar, ArrowRight, ExternalLink } from 'lucide-react'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface ArticlesSectionProps {
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export default function ArticlesSection({ lang, dict }: ArticlesSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  
  const { articles } = dict

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          setIsVisible(true)
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
      className="relative scroll-mt-28 py-20 sm:py-32 overflow-hidden bg-slate-50/50 dark:bg-transparent"
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
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* NOTA: Para produção, estes dados devem vir de um array traduzido.
              Abaixo, as labels já consomem o dicionário corretamente.
          */}
          <ArticleCard 
            title={lang === 'pt' ? "A Era dos Dados em Sistemas Críticos" : lang === 'en' ? "The Data Era in Critical Systems" : "La Era de los Datos en Sistemas Críticos"}
            description={lang === 'pt' ? "Como a governança de dados transforma sistemas legados em ativos estratégicos." : lang === 'en' ? "How data governance transforms legacy systems into strategic assets." : "Cómo la gobernanza de datos transforma sistemas heredados en activos estratégicos."}
            date="2025"
            category={articles.bestOfMonth}
            isAward={true}
            awardLabel={articles.awardWinner}
            readMoreLabel={articles.readMore}
            publishedAtLabel={articles.publishedAt}
            link="https://medium.com/@santossergioluiz"
          />
          
          <ArticleCard 
            title={lang === 'pt' ? "Databricks & Governança" : lang === 'en' ? "Databricks & Governance" : "Databricks y Gobernanza"}
            description={lang === 'pt' ? "Segurança e conformidade em pipelines de dados modernos utilizando Azure." : lang === 'en' ? "Security and compliance in modern data pipelines using Azure." : "Seguridad y cumplimiento en pipelines de datos modernos utilizando Azure."}
            date="2025"
            category="Data Engineering"
            isAward={false}
            readMoreLabel={articles.readMore}
            publishedAtLabel={articles.publishedAt}
            link="https://medium.com/@santossergioluiz"
          />
        </div>
      </div>
    </section>
  )
}

/**
 * COMPONENTE DE CARD INTERNO: Otimizado para Reuso
 */
interface ArticleCardProps {
  title: string
  description: string
  date: string
  category: string
  isAward: boolean
  awardLabel?: string
  readMoreLabel: string
  publishedAtLabel: string
  link: string
}

function ArticleCard({ 
  title, 
  description, 
  date, 
  category, 
  isAward, 
  awardLabel, 
  readMoreLabel, 
  publishedAtLabel,
  link 
}: ArticleCardProps) {
  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/5">
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
          <BookOpen className="w-6 h-6" />
        </div>
        {isAward && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200 dark:border-amber-800/50 shadow-sm">
            <Award className="w-3.5 h-3.5" />
            {awardLabel}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-blue-500" /> {publishedAtLabel} {date}
        </span>
        <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
        <span className="text-blue-600 dark:text-blue-400">{category}</span>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
        {description}
      </p>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-blue-600 transition-all"
        >
          {readMoreLabel}
          <ExternalLink className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  )
}
