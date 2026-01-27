'use client'

/**
 * FEATURED PROJECT: O principal case técnico do portfólio.
 * -----------------------------------------------------------------------------
 * - Estratégia: Transforma dados do GitHub em um case de engenharia.
 * - Parsing: Usa '|' na descrição do repo para separar: Problema | Solução | Impacto.
 * - UI: Design assimétrico com foco em legibilidade e CTAs claros.
 */

import React from 'react'
import Script from 'next/script'
import {
  Github,
  Star,
  ArrowRight,
  ExternalLink,
  Database,
  Cpu,
  Zap
} from 'lucide-react'
import type { Locale } from '@/i18n-config'

interface FeaturedProjectProps {
  readonly project: {
    name: string
    description: string | null
    html_url: string
    homepage?: string | null
    topics: string[]
  }
  readonly lang: Locale
  readonly dict?: {
    common?: {
      viewProject?: string
      liveDemo?: string
    }
    portfolio?: {
      mainCaseLabel?: string
      noDescription?: string
      projectLabels?: {
        problem?: string
        solution?: string
        impact?: string
      }
    }
  }
}

export const FeaturedProject = ({
  project,
  dict,
  lang
}: FeaturedProjectProps) => {
  /* ---------------------------------------------
   * 🌍 i18n & Dicionários
   * --------------------------------------------*/
  const common = {
    viewProject: dict?.common?.viewProject ?? (lang === 'en' ? 'View GitHub' : 'Ver GitHub'),
    liveDemo: dict?.common?.liveDemo ?? (lang === 'en' ? 'Live Demo' : lang === 'es' ? 'Demo en Vivo' : 'Demo ao Vivo')
  }

  const portfolio = dict?.portfolio

  const labels = {
    problem: portfolio?.projectLabels?.problem ?? (lang === 'en' ? 'Problem' : 'Problema'),
    impact: portfolio?.projectLabels?.impact ?? (lang === 'en' ? 'Strategic Impact' : 'Impacto Estratégico')
  }

  /* ---------------------------------------------
   * 🧠 Parsing de Descrição Estruturada
   * Descrição esperada no GitHub: "O Problema | A Solução | O Impacto"
   * --------------------------------------------*/
  const descriptionParts = project.description?.split('|').map((p) => p.trim()) ?? []
  
  const mainDescription = descriptionParts[0] ?? portfolio?.noDescription ?? 
    (lang === 'en' ? 'Description not provided.' : 'Descrição não informada.')

  // Impacto costuma ser a 3ª parte (índice 2)
  const impactText = descriptionParts[2] || descriptionParts[1]

  /* ---------------------------------------------
   * 🏷️ Filtro de Tags
   * --------------------------------------------*/
  const displayTopics = project.topics.filter(
    (t) => !['portfolio', 'featured', 'highlight', 'main'].includes(t.toLowerCase())
  )

  /* ---------------------------------------------
   * 🌍 SEO — SoftwareApplication
   * --------------------------------------------*/
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name,
    description: mainDescription,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    author: { '@type': 'Person', name: 'Sérgio Santos' },
    url: project.homepage || project.html_url,
    keywords: displayTopics.join(', ')
  }

  return (
    <>
      <Script
        id={`featured-project-${project.name}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <section
        id="featured-project"
        className="relative bg-white dark:bg-[#020617] rounded-[2.5rem] lg:rounded-[4rem] border border-slate-200 dark:border-blue-500/10 overflow-hidden group shadow-2xl transition-all duration-700"
      >
        {/* Efeito de Brilho de Fundo (Shimmer) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[580px]">
          
          {/* COLUNA VISUAL (LADO ESQUERDO/TOPO) */}
          <div className="relative h-80 lg:h-auto bg-slate-50 dark:bg-slate-950/40 flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800/50">
            
            {/* Badge de Destaque */}
            <div className="absolute top-8 left-8 z-20">
              <div className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-3 shadow-2xl shadow-blue-500/40 transform -rotate-2">
                <Star size={14} className="fill-amber-300 text-amber-300" />
                {portfolio?.mainCaseLabel ?? (lang === 'en' ? 'Flagship Project' : 'Projeto Principal')}
              </div>
            </div>

            {/* Ilustração Técnica */}
            <div className="relative flex items-center justify-center w-full h-full">
              <div className="absolute animate-pulse">
                <Cpu size={280} className="text-blue-500/5 dark:text-blue-400/5" />
              </div>
              <div className="relative transform transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3">
                <Database className="w-24 h-24 md:w-32 md:h-32 text-blue-600 dark:text-blue-500 opacity-20 dark:opacity-40" />
                <Zap className="absolute -top-2 -right-2 w-8 h-8 text-amber-500 animate-bounce" />
              </div>
            </div>
          </div>

          {/* COLUNA DE CONTEÚDO (LADO DIREITO/BAIXO) */}
          <div className="p-8 sm:p-12 lg:p-20 flex flex-col justify-center relative z-10">
            <h3
              id="featured-project-title"
              className="text-4xl md:text-5xl lg:text-7xl font-black mb-10 tracking-tighter text-slate-900 dark:text-white leading-none"
            >
              {project.name.replace(/[_-]/g, ' ')}
            </h3>

            <div className="space-y-10 mb-12">
              {/* Box de Problema */}
              <div className="pl-6 border-l-4 border-blue-500">
                <p className="text-[10px] uppercase font-black tracking-widest text-blue-600 dark:text-blue-400 mb-3">
                  {labels.problem}
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
                  {mainDescription}
                </p>
              </div>

              {/* Box de Impacto (Se disponível no pipe) */}
              {impactText && (
                <div className="flex items-center gap-4 p-5 bg-emerald-50 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 rounded-[1.5rem] border border-emerald-100 dark:border-emerald-500/10">
                  <div className="p-2 bg-emerald-500 rounded-lg text-white">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-black tracking-tighter opacity-70 mb-0.5">{labels.impact}</p>
                    <p className="font-bold text-sm md:text-base">{impactText}</p>
                  </div>
                </div>
              )}
            </div>

            {/* STACK TECNOLÓGICA */}
            <div className="flex flex-wrap gap-2.5 mb-14">
              {displayTopics.slice(0, 10).map((topic) => (
                <span
                  key={topic}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-[10px] uppercase tracking-wider font-black border border-slate-200/50 dark:border-slate-700/50"
                >
                  {topic.replace(/-/g, ' ')}
                </span>
              ))}
            </div>

            {/* AÇÕES (CTAs) */}
            <div className="flex flex-col sm:flex-row gap-5">
              <a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn flex-1 bg-slate-900 dark:bg-blue-600 text-white py-6 px-10 rounded-2xl font-black uppercase text-xs tracking-[0.25em] flex items-center justify-center gap-4 shadow-xl hover:shadow-blue-500/20 active:scale-95 transition-all"
              >
                <Github size={20} className="group-hover/btn:rotate-12 transition-transform" />
                {common.viewProject}
              </a>

              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500/50 dark:hover:border-blue-500/50 py-6 px-10 rounded-2xl font-black uppercase text-xs tracking-[0.25em] flex items-center justify-center gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50"
                >
                  <ExternalLink size={20} />
                  {common.liveDemo}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
