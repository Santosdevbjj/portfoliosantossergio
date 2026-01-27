'use client'

/**
 * PROJECT CARD: A unidade fundamental do Portfólio.
 * -----------------------------------------------------------------------------
 * - UI: Design baseado em cartões de alta densidade de informação.
 * - UX: Diferenciação clara entre projetos comuns e "Main Cases".
 * - I18n: Suporte tri-idioma (PT/EN/ES) com dicionário e fallbacks.
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
import type { Locale } from '@/i18n-config'

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
  readonly lang: Locale
  readonly dict: {
    portfolio: {
      noDescription?: string
      mainCaseLabel?: string
      featuredLabel?: string
      projectLabels: {
        problem?: string
        solution?: string
        impact?: string
      }
    }
  }
}

export function ProjectCard({ project, dict, lang }: ProjectCardProps) {
  const { portfolio } = dict

  /* -------------------------------------------------
   * 🌍 FALLBACKS I18N
   * ------------------------------------------------*/
  const fallback = {
    problem: lang === 'en' ? 'Problem' : 'Problema',
    solution: lang === 'es' ? 'Solución' : lang === 'en' ? 'Solution' : 'Solução',
    impact: lang === 'en' ? 'Impact' : 'Impacto',
    mainCase: lang === 'en' ? 'Flagship Case' : lang === 'es' ? 'Caso Principal' : 'Caso Principal',
    featured: lang === 'en' ? 'Featured' : 'Destaque',
    noDescription: lang === 'en' ? 'No description' : 'Sem descrição'
  }

  const labels = {
    problem: portfolio.projectLabels.problem ?? fallback.problem,
    solution: portfolio.projectLabels.solution ?? fallback.solution,
    impact: portfolio.projectLabels.impact ?? fallback.impact,
  }

  /* -------------------------------------------------
   * 🏷️ TÓPICOS & FLAGS
   * ------------------------------------------------*/
  const topics = project.topics ?? []
  const ADMIN_TOPICS = new Set(['portfolio', 'featured', 'main-case', 'destaque', 'highlight', 'primeiro'])

  const displayTopics = topics.filter(t => !ADMIN_TOPICS.has(t.toLowerCase()))
  const isMainCase = topics.some(t => ['main-case', 'featured'].includes(t))
  const isHighlight = topics.some(t => ['destaque', 'highlight'].includes(t))

  /* -------------------------------------------------
   * 🧠 PARSING DE CONTEÚDO
   * ------------------------------------------------*/
  const formatTopic = (topic: string) => {
    const uppercaseTechs = ['aws', 'ml', 'ai', 'sql', 'etl', 'genai', 'api']
    if (uppercaseTechs.includes(topic.toLowerCase())) return topic.toUpperCase()
    return topic.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  const descParts = project.description?.split('|').map(p => p.trim()) ?? []
  const hasStructuredDesc = descParts.length >= 2

  return (
    <article
      className={`
        group relative flex flex-col h-full 
        p-7 md:p-9 rounded-[2.5rem] border transition-all duration-500
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
        <div className="absolute -top-3 right-8 z-10">
          <span className="flex items-center gap-1.5 bg-blue-600 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
            <Star size={10} className="fill-amber-300 text-amber-300" />
            {isMainCase ? (portfolio.mainCaseLabel ?? fallback.mainCase) : (portfolio.featuredLabel ?? fallback.featured)}
          </span>
        </div>
      )}

      {/* HEADER: AÇÕES & ÍCONE */}
      <header className="flex justify-between items-start mb-8">
        <div className={`
          p-3.5 rounded-2xl transition-all duration-500
          ${isMainCase ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'}
          group-hover:rotate-6 group-hover:scale-110
        `}>
          <Folder size={28} strokeWidth={2.5} />
        </div>

        <div className="flex gap-2">
          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="flex items-center justify-center w-11 h-11 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Github size={22} />
          </a>
          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              title="Live Project"
              className="flex items-center justify-center w-11 h-11 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
            >
              <ExternalLink size={22} />
            </a>
          )}
        </div>
      </header>

      {/* TÍTULO */}
      <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {project.name.replace(/[_-]/g, ' ')}
      </h3>

      {/* CORPO DO CASE */}
      <div className="flex-grow space-y-6">
        {hasStructuredDesc ? (
          <>
            <CaseSection 
              icon={<Target size={18} />} 
              label={labels.problem} 
              text={descParts[0]} 
              type="problem" 
            />
            <CaseSection 
              icon={<Lightbulb size={18} />} 
              label={labels.solution} 
              text={descParts[1]} 
              type="solution" 
            />
            {descParts[2] && (
              <div className="pt-4 mt-2 flex items-start gap-3 border-t border-slate-100 dark:border-slate-800/40">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <TrendingUp size={14} />
                </div>
                <p className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight italic">
                  {descParts[2]}
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed italic">
            {project.description || (portfolio.noDescription ?? fallback.noDescription)}
          </p>
        )}
      </div>

      {/* TECH STACK FOOTER */}
      <footer className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/40 flex flex-wrap gap-2">
        {displayTopics.slice(0, 4).map(topic => (
          <span
            key={topic}
            className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-100 dark:border-slate-700/50"
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

function CaseSection({ icon, label, text, type }: { icon: React.ReactNode, label: string, text: string, type: 'problem' | 'solution' }) {
  const styles = type === 'problem' 
    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'

  return (
    <div className="flex gap-4 group/section">
      <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover/section:-rotate-12 ${styles}`}>
        {icon}
      </div>
      <div>
        <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
          {label}
        </span>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug font-medium line-clamp-3">
          {text}
        </p>
      </div>
    </div>
  )
}
