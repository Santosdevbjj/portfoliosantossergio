'use client'

import { useMemo, useState } from 'react'
import { Database, Filter, FolderSearch } from 'lucide-react'

import { ProjectCard } from '@/components/ProjectCard'
import type { Locale } from '@/i18n-config'
import type { Dictionary } from '@/types/Dictionary'
import type { Project } from '@/domain/projects'

interface ProjectSectionProps {
  projects: Project[]
  lang: Locale
  dict: Dictionary
}

/**
 * PROJECT SECTION
 * Arquitetura sênior: narrativa, filtro, ranking e responsividade
 */
export function ProjectSection({
  projects,
  lang,
  dict,
}: ProjectSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | string>('all')

  const portfolio = dict.portfolio

  const normalize = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, '')

  /**
   * Ranking + filtro estratégico
   */
  const filteredProjects = useMemo(() => {
    let base = projects.filter((p) =>
      p.topics.includes('portfolio')
    )

    if (activeCategory !== 'all') {
      const normalizedCategory = normalize(activeCategory)
      base = base.filter((p) =>
        p.topics.some(
          (topic) => normalize(topic) === normalizedCategory
        )
      )
    }

    return base.sort((a, b) => {
      const aPriority = a.isMainCase ? 0 : a.isFeatured ? 1 : 2
      const bPriority = b.isMainCase ? 0 : b.isFeatured ? 1 : 2

      if (aPriority !== bPriority) return aPriority - bPriority
      return (
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime()
      )
    })
  }, [projects, activeCategory])

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between gap-10 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-blue-600 shadow-xl shadow-blue-600/20">
                <Database className="w-7 h-7 text-white" />
              </div>
              <h2
                id="projects-title"
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase"
              >
                {portfolio.title}
              </h2>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
              {filteredProjects.length} {portfolio.resultsLabel}
            </p>
          </div>

          {/* FILTERS */}
          <nav aria-label={portfolio.filterLabel}>
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-[0.25em]">
              <Filter className="w-4 h-4 text-blue-600" />
              {portfolio.filterLabel}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <FilterButton
                active={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
                label={portfolio.all}
              />

              {Object.entries(portfolio.categories).map(
                ([key, label]) => (
                  <FilterButton
                    key={key}
                    active={activeCategory === key}
                    onClick={() => setActiveCategory(key)}
                    label={label}
                  />
                )
              )}
            </div>
          </nav>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                lang={lang}
                dict={dict}
              />
            ))
          ) : (
            <EmptyState message={portfolio.empty} />
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- */
/* UI primitives internos (isolados)  */
/* ---------------------------------- */

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
      className={`min-h-[44px] px-6 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
        active
          ? 'bg-blue-600 border-blue-600 text-white shadow-xl'
          : 'border-slate-200 text-slate-500 hover:border-blue-500/40'
      }`}
    >
      {label}
    </button>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-32 border-4 border-dashed rounded-[4rem]">
      <FolderSearch className="w-20 h-20 text-slate-300 mb-6" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-center">
        {message}
      </p>
    </div>
  )
}
