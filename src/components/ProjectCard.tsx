'use client'

/**
 * PROJECT CARD: A unidade fundamental do Portfólio.
 * -----------------------------------------------------------------------------
 * - UI: Design baseado em cartões de alta densidade, totalmente responsivo.
 * - UX: Diferenciação entre projetos comuns, destaques e casos principais.
 * - Alinhamento: Sincronizado com src/dictionaries/index.ts e src/types/dictionary.ts
 */

import React from 'react'
import {
  Github,
  ExternalLink,
  Folder,
  Star,
  Target,
  Lightbulb,
  TrendingUp,
} from 'lucide-react'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface GitHubProject {
  id?: number
  name: string
  description: string | null
  html_url: string
  homepage?: string | null
  topics?: string[]
}

interface ProjectCardProps {
  readonly project: GitHubProject
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export function ProjectCard({ project, dict, lang }: ProjectCardProps) {
  const { projects: labels } = dict

  /* -------------------------------------------------
   * 🏷️ TÓPICOS & FLAGS (GitHub Topics)
   * ------------------------------------------------*/
  const topics = project.topics ?? []
  const ADMIN_TOPICS = new Set(['portfolio', 'featured', 'main-case', 'destaque', 'highlight', 'primeiro'])

  const displayTopics = topics.filter(t => !ADMIN_TOPICS.has(t.toLowerCase()))
  const isMainCase = topics.some(t => ['main-case', 'primeiro'].includes(t.toLowerCase()))
  const isHighlight = topics.some(t => ['featured', 'destaque', 'highlight'].includes(t.toLowerCase()))

  /* -------------------------------------------------
   * 🌍 TRADUÇÃO DE SEÇÕES ESTRUTURADAS
   * ------------------------------------------------*/
  const sectionLabels = {
    pt: { problem: 'Desafio', solution: 'Solução', impact: 'Impacto' },
    en: { problem: 'Challenge', solution: 'Solution', impact: 'Impact' },
    es: { problem: 'Desafío', solution: 'Solución', impact: 'Impacto' },
  }[lang]

  /* -------------------------------------------------
   * 🧠 PARSING DE CONTEÚDO (Separado por | no GitHub)
   * ------------------------------------------------*/
  const formatTopic = (topic: string) => {
    const uppercaseTechs = ['aws', 'ml', 'ai', 'sql', 'etl', 'genai', 'api', 'bi']
    if (uppercaseTechs.includes(topic.toLowerCase())) return topic.toUpperCase()
    return topic.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  const descParts = project.description?.split('|').map(p => p.trim()) ?? []
  
  // CORREÇÃO: Garantimos que descParts sempre tenha strings para evitar erro de 'undefined'
  const problemText = descParts[0] || project.description || ''
  const solutionText = descParts[1] || ''
  const impactText = descParts[2] || ''

  return (
    <article
      className={`
        group relative flex flex-col h-full 
        p-6 md:p-8 rounded-[2rem] border transition-all duration-500
        ${
          isMainCase
            ? 'border-blue-500/30 bg-white dark:bg-slate-900 shadow-2xl shadow-blue-500/5 ring-1 ring-blue-500/10'
            : 'border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-950 shadow-sm hover:border-blue-500/20'
        }
        hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10
      `}
    >
      {/* BADGE DE PRIORIDADE */}
      {(isMainCase || isHighlight) && (
        <div className="absolute -top-3 right-6 z-10">
          <span className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-blue-500/20">
            <Star size={10} className="fill-amber-300 text-amber-300" />
            {isMainCase ? labels.firstLabel : labels.featuredLabel}
          </span>
        </div>
      )}

      {/* HEADER: AÇÕES & ÍCONE */}
      <header className="flex justify-between items-start mb-6">
        <div className={`
          p-3 rounded-xl transition-all duration-500
          ${isMainCase ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'}
          group-hover:rotate-6 group-hover:scale-110
        `}>
          <Folder size={24} strokeWidth={2.5} />
        </div>

        <div className="flex gap-1.5">
          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            title={labels.repoLink}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Github size={20} />
          </a>
          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              title={labels.viewProject}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </header>

      {/* TÍTULO */}
      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {project.name.replace(/[_-]/g, ' ')}
      </h3>

      {/* CORPO DO CASE */}
      <div className="flex-grow space-y-5">
        {/* Desafio / Problema */}
        <CaseSection 
          icon={<Target size={16} />} 
          label={sectionLabels.problem} 
          text={problemText} 
          type="problem" 
        />

        {/* Solução Técnica */}
        {solutionText && (
          <CaseSection 
            icon={<Lightbulb size={16} />} 
            label={sectionLabels.solution} 
            text={solutionText} 
            type="solution" 
          />
        )}

        {/* Impacto / Resultado */}
        {impactText && (
          <div className="pt-3 mt-1 flex items-start gap-2 border-t border-slate-100 dark:border-slate-800/40">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={12} />
            </div>
            <div>
               <span className="block text-[8px] font-black uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 mb-0.5">
                {sectionLabels.impact}
              </span>
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight italic">
                {impactText}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* TECH STACK FOOTER */}
      <footer className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800/40 flex flex-wrap gap-1.5">
        {displayTopics.slice(0, 4).map(topic => (
          <span
            key={topic}
            className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-100 dark:border-slate-700/50"
          >
            {formatTopic(topic)}
          </span>
        ))}
        {displayTopics.length > 4 && (
          <span className="text-[10px] font-bold text-slate-400 self-center ml-1">
            +{displayTopics.length - 4}
          </span>
        )}
      </footer>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/* HELPER COMPONENT: CaseSection                                               */
/* -------------------------------------------------------------------------- */

interface CaseSectionProps {
  icon: React.ReactNode
  label: string
  text: string
  type: 'problem' | 'solution'
}

function CaseSection({ icon, label, text, type }: CaseSectionProps) {
  const styles = type === 'problem' 
    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' 
    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'

  return (
    <div className="flex gap-3 group/section">
      <div className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover/section:-rotate-12 ${styles}`}>
        {icon}
      </div>
      <div>
        <span className="block text-[8px] font-black uppercase tracking-[0.15em] text-slate-400 mb-0.5">
          {label}
        </span>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug font-medium line-clamp-3">
          {text}
        </p>
      </div>
    </div>
  )
}
