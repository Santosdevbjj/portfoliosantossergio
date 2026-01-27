'use client'

/**
 * FEATURED PROJECTS SECTION: A Vitrine Tecnológica
 * -----------------------------------------------------------------------------
 * - UI: Design de alta densidade com elementos decorativos em glow.
 * - I18n: Totalmente alinhado com o dicionário (PT, EN, ES).
 * - Layout: Totalmente responsivo e otimizado.
 */

import React from 'react'
import FeaturedGrid from './FeaturedGrid'
import { type Locale } from '@/i18n-config'
import { type Dictionary } from '@/types/dictionary'

interface FeaturedProjectsSectionProps {
  readonly lang: Locale
  readonly dict: Dictionary
}

export default function FeaturedProjectsSection({ lang, dict }: FeaturedProjectsSectionProps) {
  // Extraímos os dados diretamente do dicionário JSON fornecido
  const { projects } = dict

  // Labels de UI que não estão no JSON, mas seguem o idioma
  const badgeLabel = {
    pt: 'Portfólio',
    en: 'Portfolio',
    es: 'Portafolio'
  }

  // Subtítulo dinâmico para preencher o layout caso não esteja no JSON, 
  // mantendo a consistência com a descrição do herói/sobre.
  const sectionSubtitle = {
    pt: 'Uma seleção estratégica de sistemas e análises que consolidam minha experiência em engenharia e ciência de dados.',
    en: 'A strategic selection of systems and analyses showcasing my expertise in data engineering and data science.',
    es: 'Una selección estratégica de sistemas y análisis que consolidan mi experiencia en ingeniería y ciencia de datos.'
  }

  return (
    <section
      id="projects"
      className="relative scroll-mt-28 py-20 sm:py-28 lg:py-40 overflow-hidden"
      aria-labelledby="projects-title"
      itemScope
      itemType="https://schema.org/CollectionPage"
    >
      {/* Elementos Decorativos de Fundo (Glow) */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] bg-indigo-600/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" 
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* HEADER DA SEÇÃO */}
        <header className="relative mb-16 md:mb-24">
          {/* Badge Superior */}
          <div className="flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="h-px w-8 bg-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
              {badgeLabel[lang] || badgeLabel.en}
            </span>
          </div>

          <div className="max-w-3xl">
            <h2
              id="projects-title"
              itemProp="name"
              className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]"
            >
              {projects.title}
            </h2>

            <p 
              itemProp="description"
              className="mt-8 text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium max-w-2xl"
            >
              {sectionSubtitle[lang] || sectionSubtitle.en}
            </p>
          </div>
        </header>

        {/* GRID DE PROJETOS */}
        <div className="relative">
          {/* O componente FeaturedGrid também precisará receber 'dict' ou 'lang' para se traduzir */}
          <FeaturedGrid lang={lang} />
        </div>
      </div>

      {/* Linha de Base Decorativa */}
      <div className="mt-20 sm:mt-32 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
      </div>
    </section>
  )
}
