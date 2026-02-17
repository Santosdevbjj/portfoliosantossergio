'use client'

import { useMemo, useState } from 'react'
import { Database, Filter, FolderSearch } from 'lucide-react'

import { ProjectCard } from '@/components/ProjectCard'
import type { Locale, Dictionary, ProjectCategories } from '@/types/dictionary'
import type { ProjectDomain } from '@/domain/projects'

type CategoryKey = keyof ProjectCategories
type ActiveCategory = 'all' | CategoryKey


interface ProjectSectionProps {
  readonly projects: readonly ProjectDomain[]
  readonly lang: Locale
  readonly dict: Dictionary
}

export default function ProjectSection({
  projects,
  lang,
  dict,
}: ProjectSectionProps) {
  const [activeCategory, setActiveCategory] =
    useState<ActiveCategory>('all')

  const projectDict = dict.projects
  const statesDict = dict.states

  const categoryEntries = Object.entries(
    projectDict.categories,
  ) as Array<[CategoryKey, string]>

  const filteredProjects = useMemo(() => {
    const base =
      activeCategory === 'all'
        ? projects
        : projects.filter(
            p => p.technology.labelKey === activeCategory,
          )

    return [...base].sort((a, b) => {
      if (a.isFirst !== b.isFirst) return a.isFirst ? -1 : 1
      if (a.isFeatured !== b.isFeatured)
        return a.isFeatured ? -1 : 1
      return 0
    })
  }, [projects, activeCategory])

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="py-16 bg-white dark:bg-[#020617]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <header className="flex flex-col lg:flex-row justify-between gap-10 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-blue-600 text-white">
                <Database className="w-6 h-6" />
              </div>
              <h2
                id="projects-title"
                className="text-4xl md:text-5xl font-black"
              >
                {projectDict.title}
              </h2>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              {filteredProjects.length}{' '}
              {statesDict.emptyProjects.cta}
            </p>
          </div>

          <nav aria-label={dict.common.navigation}>
            <div className="flex items-center gap-2 mb-3 text-[9px] font-black uppercase tracking-widest">
              <Filter className="w-3 h-3" />
              {dict.common.navigation}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              <FilterButton
                active={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
                label={projectDict.viewAll}
              />

              {categoryEntries.map(([key, label]) => (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[300px]">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                lang={lang}
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
      className={`px-6 py-2 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest ${
        active
          ? 'bg-blue-600 text-white border-blue-600'
          : 'border-slate-300 text-slate-500'
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
    <div className="col-span-full flex flex-col items-center py-20">
      <FolderSearch className="w-12 h-12 mb-4 text-slate-300" />
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-xs uppercase tracking-widest text-slate-400">
        {message}
      </p>
    </div>
  )
}
