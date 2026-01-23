'use client'

import React from 'react'
import { Github, Star, Layout, ArrowRight, ExternalLink, Database, Cpu } from 'lucide-react'

interface FeaturedProjectProps {
  project: {
    name: string
    description: string | null
    html_url: string
    homepage?: string | null
    topics: string[]
  }
  lang: 'pt' | 'en' | 'es'
  dict: {
    common: {
      viewProject: string
      liveDemo: string
    }
    portfolio: {
      mainCaseLabel: string
      noDescription: string
      projectLabels: {
        problem: string
        solution: string
        impact?: string
      }
    }
  }
}

/**
 * FEATURED PROJECT - FLAGSHIP CASE
 * Design premium, responsivo e multilingue.
 */
export const FeaturedProject = ({ project, dict, lang }: FeaturedProjectProps) => {
  const portfolio = dict?.portfolio || {}
  const common = dict?.common || { 
    viewProject: lang === 'pt' ? 'Ver GitHub' : lang === 'es' ? 'Ver GitHub' : 'View GitHub', 
    liveDemo: lang === 'pt' ? 'Demo ao Vivo' : lang === 'es' ? 'Demo en Vivo' : 'Live Demo' 
  }
  const labels = portfolio?.projectLabels || { 
    problem: lang === 'pt' ? 'Problema' : lang === 'es' ? 'Problema' : 'Problem', 
    solution: lang === 'pt' ? 'Solução' : lang === 'es' ? 'Solución' : 'Solution', 
    impact: lang === 'pt' ? 'Impacto' : lang === 'es' ? 'Impacto' : 'Impact' 
  }

  const descriptionParts = project?.description ? project.description.split('|') : []
  const hasStructuredDesc = descriptionParts.length >= 1

  const displayTopics = (project?.topics || []).filter((t) => 
    !['portfolio', 'featured', 'primeiro', 'destaque', 'highlight', 'main'].includes(t.toLowerCase())
  )

  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[4rem] border border-blue-500/10 dark:border-blue-500/20 overflow-hidden group shadow-2xl transition-all duration-700 hover:shadow-blue-500/5 hover:border-blue-500/40">

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[550px] lg:min-h-[500px]">
        
        {/* LADO VISUAL */}
        <div className="relative h-72 sm:h-96 lg:h-auto bg-slate-50 dark:bg-slate-950/50 overflow-hidden flex items-center justify-center order-1">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08),transparent_70%)]" />

          <div className="absolute top-8 left-8 z-20">
            <div className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2.5 shadow-xl">
              <Star size={14} fill="currentColor" className="text-amber-300 animate-pulse" />
              {portfolio?.mainCaseLabel || (lang === 'pt' ? 'Caso Principal' : lang === 'es' ? 'Caso Principal' : 'Flagship Case')}
            </div>
          </div>

          <div className="relative z-0 flex items-center justify-center w-full h-full transition-all duration-1000 group-hover:scale-110">
            <Cpu size={200} className="text-blue-500/5 dark:text-blue-400/5 absolute" strokeWidth={0.5} />
            <div className="relative flex items-center justify-center">
              <div className="absolute w-40 h-40 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
              <Database className="w-24 h-24 md:w-32 md:h-32 text-blue-600 dark:text-blue-500 opacity-20 dark:opacity-40" strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* LADO CONTEÚDO */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center order-2 bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/50 relative">

          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter capitalize leading-none group-hover:text-blue-600 transition-colors duration-500 break-words">
            {project?.name?.replace(/[_-]/g, ' ') || 'Special Project'}
          </h3>

          <div className="space-y-8 mb-12">
            {hasStructuredDesc && descriptionParts[0] ? (
              <div className="space-y-8">
                <div className="relative pl-8 border-l-4 border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase mb-3 tracking-[0.3em]">
                    {labels.problem}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed font-medium break-words">
                    {descriptionParts[0].trim()}
                  </p>
                </div>

                {descriptionParts[2] && (
                  <div className="inline-flex items-center gap-4 px-6 py-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-2xl text-sm md:text-base font-bold border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                    <div className="p-1 bg-emerald-500 rounded-lg text-white">
                      <ArrowRight size={16} strokeWidth={3} />
                    </div>
                    <span>{descriptionParts[2].trim()}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium opacity-80 break-words">
                {project?.description || portfolio?.noDescription || (lang === 'pt' ? 'Documentação pendente...' : lang === 'es' ? 'Documentación pendiente...' : 'Documentation pending...')}
              </p>
            )}
          </div>

          {/* Tech Stack Chips */}
          <div className="flex flex-wrap gap-2.5 mb-12">
            {displayTopics.slice(0, 8).map((topic) => (
              <span 
                key={topic} 
                className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all break-words"
              >
                {topic.replace(/-/g, ' ')}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <a 
              href={project?.html_url} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex-[2] bg-slate-900 dark:bg-blue-600 text-white text-center py-5 px-10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-black dark:hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/20 active:scale-95 touch-manipulation break-words"
            >
              <Github size={20} />
              {common.viewProject}
            </a>

            {project?.homepage && (
              <a 
                href={project.homepage} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 py-5 px-10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3 active:scale-95 touch-manipulation break-words"
              >
                <ExternalLink size={20} />
                {common.liveDemo}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
