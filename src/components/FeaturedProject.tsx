'use client'

/**
 * FEATURED PROJECT: O principal case técnico do portfólio.
 * -----------------------------------------------------------------------------
 * Revisado: 100% Tipado, Multilingue (PT, EN, ES) e Responsivo.
 */

import Script from 'next/script'
import { Github, Star, ArrowRight, ExternalLink, Database, Cpu, Zap } from 'lucide-react'
import type { Dictionary } from '@/types/dictionary'

interface FeaturedProjectProps {
  readonly project: {
    name: string
    description: string | null
    html_url: string
    homepage?: string | null
    topics: string[]
  }
  readonly dict: Dictionary
}

export const FeaturedProject = ({ project, dict }: FeaturedProjectProps) => {
  // Desestruturação segura baseada nas interfaces do seu dictionary.ts
  const { projects, states } = dict;

  // Parsing da descrição do GitHub: "Problema | Solução | Impacto"
  const descriptionParts = project.description?.split('|').map((p) => p.trim()) ?? []
  const mainDescription = descriptionParts[0] || project.description || states.empty;
  const impactText = descriptionParts[2] || descriptionParts[1];

  const displayTopics = project.topics.filter(
    (t) => !['portfolio', 'featured', 'highlight', 'main'].includes(t.toLowerCase())
  )

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

      <section className="relative bg-white dark:bg-[#020617] rounded-[2.5rem] lg:rounded-[4rem] border border-slate-200 dark:border-blue-500/10 overflow-hidden group shadow-2xl transition-all duration-700">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[580px]">
          
          {/* COLUNA VISUAL - Totalmente Responsiva */}
          <div className="relative h-72 sm:h-80 lg:h-auto bg-slate-50 dark:bg-slate-950/40 flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800/50">
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
              <div className="bg-blue-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-3 shadow-2xl shadow-blue-500/40 transform -rotate-2">
                <Star size={14} className="fill-amber-300 text-amber-300" />
                {/* Removido o (as any) - Agora usa a chave do dicionário */}
                {projects.featuredLabel}
              </div>
            </div>

            <div className="relative flex items-center justify-center w-full h-full">
              <div className="absolute animate-pulse">
                <Cpu className="w-40 h-40 sm:w-64 sm:h-64 lg:w-[280px] lg:h-[280px] text-blue-500/5 dark:text-blue-400/5" />
              </div>
              <div className="relative transform transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3">
                <Database className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 text-blue-600 dark:text-blue-500 opacity-20 dark:opacity-40" />
                <Zap className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 text-amber-500 animate-bounce" />
              </div>
            </div>
          </div>

          {/* COLUNA DE CONTEÚDO */}
          <div className="p-6 sm:p-10 lg:p-16 xl:p-20 flex flex-col justify-center relative z-10">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 lg:mb-10 tracking-tighter text-slate-900 dark:text-white leading-tight capitalize">
              {project.name.replace(/[_-]/g, ' ')}
            </h3>

            <div className="space-y-8 lg:space-y-10 mb-10 lg:mb-12">
              <div className="pl-6 border-l-4 border-blue-500">
                <p className="text-[10px] uppercase font-black tracking-widest text-blue-600 dark:text-blue-400 mb-3">
                  {projects.firstLabel}
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
                  {mainDescription}
                </p>
              </div>

              {impactText && (
                <div className="flex items-center gap-4 p-4 sm:p-5 bg-emerald-50 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 rounded-[1.5rem] border border-emerald-100 dark:border-emerald-500/10">
                  <div className="p-2 bg-emerald-500 rounded-lg text-white flex-shrink-0">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-black tracking-tighter opacity-70 mb-0.5">
                      {projects.impactLabel}
                    </p>
                    <p className="font-bold text-xs sm:text-sm md:text-base">{impactText}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tags de Tecnologia */}
            <div className="flex flex-wrap gap-2 mb-10 lg:mb-14">
              {displayTopics.slice(0, 8).map((topic) => (
                <span key={topic} className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-[9px] sm:text-[10px] uppercase tracking-wider font-black border border-slate-200/50 dark:border-slate-700/50">
                  {topic.replace(/-/g, ' ')}
                </span>
              ))}
            </div>

            {/* Ações / Botões */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn flex-1 bg-slate-900 dark:bg-blue-600 text-white py-5 sm:py-6 px-8 rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-[0.25em] flex items-center justify-center gap-4 shadow-xl hover:shadow-blue-500/20 active:scale-95 transition-all"
              >
                <Github size={20} className="group-hover/btn:rotate-12 transition-transform" />
                {projects.viewProject}
              </a>
              
              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500/50 dark:hover:border-blue-500/50 py-5 sm:py-6 px-8 rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-[0.25em] flex items-center justify-center gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50"
                >
                  <ExternalLink size={20} />
                  {projects.viewDemo}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
