'use client'

import { useMemo, useState } from 'react'
import { Database, Filter, FolderSearch } from 'lucide-react'

import { ProjectCard } from '@/components/ProjectCard'
import type { Locale, Dictionary, ProjectCategories, CategoryDetail } from '@/types/dictionary'
import type { ProjectDomain } from '@/domain/projects'

/**
 * PROJECT SECTION COMPONENT
 * -----------------------------------------------------------------------------
 * ✔ Stack: React 19, TS 6.0, Tailwind 4.2 (OK)
 * ✔ I18n: Suporte PT/EN/ES via Dictionary (OK)
 * ✔ Responsividade: Grid adaptativo e scroll lateral em mobile (OK)
 * ✔ Correção: Tipagem de CategoryDetail para Object.entries (OK)
 */

type CategoryKey = keyof ProjectCategories
type ActiveCategory = 'all' | CategoryKey

interface ProjectSectionProps {
  readonly projects: ReadonlyArray<ProjectDomain>
  readonly lang: Locale
  readonly dict: Dictionary
}

export default function ProjectSection({
  projects,
  dict,
}: ProjectSectionProps) {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('all')

  const projectDict = dict.projects
  const statesDict = dict.states

  // Correção da Tipagem: Object.entries agora reconhece que o valor é CategoryDetail
  const categoryEntries = Object.entries(projectDict.categories) as Array<[CategoryKey, CategoryDetail]>

  const filteredProjects = useMemo(() => {
    const base =
      activeCategory === 'all'
        ? projects
        : projects.filter(
            p => p.technology.labelKey === activeCategory,
          )

    // Ordenação robusta (TS 6.0 optimized)
    return [...base].sort((a, b) => {
      if (a.isFirst !== b.isFirst) return a.isFirst ? -1 : 1
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1
      return 0
    })
  }, [projects, activeCategory])

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="py-16 bg-white dark:bg-[#020617] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                <Database className="w-6 h-6" />
              </div>
              <h2
                id="projects-title"
                className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white"
              >
                {projectDict.title}
              </h2>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 ml-1">
              {filteredProjects.length} {statesDict.emptyProjects.cta}
            </p>
          </div>

          <nav aria-label={dict.common.navigation} className="w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <Filter className="w-3 h-3" />
              {dict.common.navigation}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              <FilterButton
                active={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
                label={projectDict.viewAll}
              />

              {categoryEntries.map(([key, category]) => (
                <FilterButton
                  key={key}
                  active={activeCategory === key}
                  onClick={() => setActiveCategory(key)}
                  // Acessamos .labelKey conforme definido no seu JSON/Interface
                  label={category.labelKey}
                />
              ))}
            </div>
          </nav>
        </header>

        {/* Grid Responsivo Tailwind 4.2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                dict={dict}
              />
            ))
          ) : (
            <EmptyState
              title={statesDict.emptyProjects.title}
              message={statesDict.emptyProjects.description}
            />
          )}
        </div>
      </div>
    </section>
  )
}

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
      className={`whitespace-nowrap px-6 py-2.5 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
        active
          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
          : 'border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-500 dark:border-slate-800'
      }`}
    >
      {label}
    </button>
  )
}

function EmptyState({
  title,
  message,
}: {
  title: string
  message: string
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
      <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-900 mb-6">
        <FolderSearch className="w-12 h-12 text-slate-300 dark:text-slate-700" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        {message}
      </p>
    </div>
  )
}
