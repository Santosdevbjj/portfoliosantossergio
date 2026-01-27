'use client'

/**
 * PROJECT SECTION: Orquestrador de Portfólio
 * -----------------------------------------------------------------------------
 * - Responsividade: Grid adaptativo e filtros horizontais touch-friendly.
 * - I18n: Consumo integral de dicionários para PT, EN e ES.
 * - UX: Filtragem reativa com transições suaves e ranking de relevância.
 */

import { useMemo, useState } from 'react'
import { Database, Filter, FolderSearch, LayoutGrid } from 'lucide-react'

import { ProjectCard } from '@/components/ProjectCard'
import type { Locale } from '@/i18n-config'
import type { Dictionary } from '@/types/Dictionary'
import type { Project } from '@/domain/projects'

interface ProjectSectionProps {
  readonly projects: Project[]
  readonly lang: Locale
  readonly dict: Dictionary
}

export function ProjectSection({
  projects = [],
  lang,
  dict,
}: ProjectSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | string>('all')

  const portfolio = dict.portfolio

  /**
   * Normalização de strings para comparação segura de tags/tópicos
   */
  const normalize = (value: string) =>
    value?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? ''

  /**
   * ENGINE DE FILTRAGEM + RANKING
   * Prioriza: Main Case > Featured > Data Atualização
   */
  const filteredProjects = useMemo(() => {
    // Filtra apenas o que deve ir para o portfólio
    let base = projects.filter(
      (p) => p.topics?.includes('portfolio')
    )

    // Aplica filtro de categoria se não for 'all'
    if (activeCategory !== 'all') {
      const normalizedCategory = normalize(activeCategory)
      base = base.filter((p) =>
        p.topics?.some(
          (topic) => normalize(topic) === normalizedCategory
        )
      )
    }

    // Ordenação Inteligente
    return base.sort((a, b) => {
      const aPriority = a.isMainCase ? 0 : a.isFeatured ? 1 : 2
      const bPriority = b.isMainCase ? 0 : b.isFeatured ? 1 : 2

      if (aPriority !== bPriority) return aPriority - bPriority

      const aDate = new Date(a.updatedAt || 0).getTime()
      const bDate = new Date(b.updatedAt || 0).getTime()

      return bDate - aDate
    })
  }, [projects, activeCategory])

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="py-24 lg:py-40 bg-white dark:bg-[#020617] transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* CABEÇALHO DA SEÇÃO */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3.5 rounded-2xl bg-blue-600 text-white shadow-2xl shadow-blue-500/30">
                <Database className="w-8 h-8" aria-hidden />
              </div>
              <h2
                id="projects-title"
                className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-slate-900 dark:text-white"
              >
                {portfolio.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-1 bg-blue-600 rounded-full" />
              <p
                className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400"
                aria-live="polite"
              >
                {filteredProjects.length} {portfolio.resultsLabel}
              </p>
            </div>
          </div>

          {/* NAVEGAÇÃO DE FILTROS */}
          <nav
            aria-label={portfolio.filterLabel}
            className="w-full lg:w-auto"
          >
            <div className="flex items-center gap-2 mb-5 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              <Filter className="w-4 h-4 text-blue-600" aria-hidden />
              {portfolio.filterLabel}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 pb-2 snap-x touch-pan-x">
              <FilterButton
                active={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
                label={portfolio.all}
              />

              {Object.entries(portfolio.categories).map(([key, label]) => (
                <FilterButton
                  key={key}
                  active={activeCategory === key}
                  onClick={() => setActiveCategory(key)}
                  label={label}
                />
              ))}
            </div>
          </nav>
        </header>

        {/* GRADE DE RESULTADOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 min-h-[400px]">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div 
                key={project.id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <ProjectCard
                  project={project}
                  lang={lang}
                  dict={dict}
                />
              </div>
            ))
          ) : (
            <EmptyState message={portfolio.empty} />
          )}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* COMPONENTES DE INTERFACE PRIVADOS                                           */
/* -------------------------------------------------------------------------- */

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`
        min-h-[48px] px-8 py-3.5 rounded-2xl border-2
        text-[10px] font-black uppercase tracking-widest
        transition-all duration-300 whitespace-nowrap snap-start
        active:scale-95
        ${
          active
            ? 'bg-slate-900 border-slate-900 dark:bg-blue-600 dark:border-blue-600 text-white shadow-xl shadow-blue-500/20'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-500/40'
        }
      `}
    >
      {label}
    </button>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-32 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-900/50 bg-slate-50/30 dark:bg-slate-900/10">
      <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl mb-8">
        <FolderSearch
          className="w-20 h-20 text-slate-200 dark:text-slate-800"
          aria-hidden
        />
      </div>
      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 text-center max-w-sm leading-relaxed px-6">
        {message}
      </p>
    </div>
  )
}
